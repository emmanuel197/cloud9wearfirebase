import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  loginSchema,
  CartItem
} from "@shared/schema";
import { ZodError } from "zod";

declare global {
  namespace Express {
    interface Request {
      requireRole(roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Role-based authorization middleware
  const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }
      
      next();
    };
  };

  // Error handler for Zod validation errors
  const handleZodError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { category, supplierId } = req.query;
      const filters: any = {
        isActive: true,
      };
      
      if (category) filters.category = category;
      if (supplierId) filters.supplierId = Number(supplierId);
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireRole(["admin", "supplier"]), async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      
      // If supplier is creating product, ensure supplierId is their own ID
      if (req.user.role === "supplier") {
        productData.supplierId = req.user.id;
      }
      
      const product = await storage.createProduct(productData);
      
      // Initialize inventory for the supplier
      await storage.updateInventory(product.supplierId, product.id, product.stock);
      
      res.status(201).json(product);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/products/:id", requireRole(["admin", "supplier"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Suppliers can only update their own products
      if (req.user.role === "supplier" && product.supplierId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own products" });
      }
      
      const updatedProduct = await storage.updateProduct(productId, req.body);
      
      // Update inventory if stock changed
      if (req.body.stock !== undefined) {
        await storage.updateInventory(product.supplierId, productId, req.body.stock);
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(productId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Orders API
  app.get("/api/orders", requireRole(["admin", "customer"]), async (req, res) => {
    try {
      const filters: any = {};
      
      // Customers can only see their own orders
      if (req.user.role === "customer") {
        filters.customerId = req.user.id;
      } else if (req.query.customerId) {
        filters.customerId = Number(req.query.customerId);
      }
      
      if (req.query.status) {
        filters.status = req.query.status;
      }
      
      const orders = await storage.getOrders(filters);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", requireRole(["admin", "customer"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Customers can only view their own orders
      if (req.user.role === "customer" && order.customerId !== req.user.id) {
        return res.status(403).json({ message: "You can only view your own orders" });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(orderId);
      
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", requireRole(["customer"]), async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        customerId: req.user.id
      });
      
      // Create the order
      const order = await storage.createOrder(orderData);
      
      // Add order items
      const orderItems = req.body.items || [];
      for (const item of orderItems) {
        const orderItemData = insertOrderItemSchema.parse({
          ...item,
          orderId: order.id
        });
        
        await storage.addOrderItem(orderItemData);
        
        // Update product stock
        const product = await storage.getProduct(item.productId);
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await storage.updateProduct(item.productId, { stock: newStock });
          await storage.updateInventory(product.supplierId, product.id, newStock);
        }
      }
      
      // Clear user's cart
      await storage.updateCart(req.user.id, []);
      
      res.status(201).json(order);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/orders/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updateOrder(orderId, req.body);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Cart API
  app.get("/api/cart", requireRole(["customer"]), async (req, res) => {
    try {
      const cart = await storage.getCart(req.user.id);
      res.json(cart || { userId: req.user.id, items: [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.put("/api/cart", requireRole(["customer"]), async (req, res) => {
    try {
      const items = req.body.items as CartItem[];
      const cart = await storage.updateCart(req.user.id, items);
      res.json(cart);
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  // Supplier inventory API
  app.get("/api/inventory", requireRole(["supplier"]), async (req, res) => {
    try {
      const inventory = await storage.getInventory(req.user.id);
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.put("/api/inventory/:productId", requireRole(["supplier"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const { stock } = req.body;
      
      if (typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ message: "Invalid stock value" });
      }
      
      const product = await storage.getProduct(productId);
      
      // Check if product exists and belongs to the supplier
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.supplierId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own inventory" });
      }
      
      const inventory = await storage.updateInventory(req.user.id, productId, stock);
      
      // Also update the product stock
      await storage.updateProduct(productId, { stock });
      
      res.json(inventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", requireRole(["admin"]), async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const products = await storage.getProducts();
      const customers = await storage.getUsersByRole("customer");
      const suppliers = await storage.getUsersByRole("supplier");
      
      // Calculate total sales
      const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Calculate pending orders
      const pendingOrders = orders.filter(order => order.status === "pending").length;
      
      // Group orders by status
      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json({
        totalSales,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalSuppliers: suppliers.length,
        ordersByStatus
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
