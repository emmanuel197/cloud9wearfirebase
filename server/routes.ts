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
import Paystack from "paystack-node";

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
  
  // Initialize Paystack API client
  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error("Missing PAYSTACK_SECRET_KEY environment variable");
  }
  const paystackClient = new Paystack(process.env.PAYSTACK_SECRET_KEY || "");
  
  // Check if Paystack client is properly initialized
  if (!paystackClient || !paystackClient.transaction) {
    console.error("Failed to initialize Paystack client properly");
  }

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

  // Admin users management
  app.get("/api/admin/customers", requireRole(["admin"]), async (req, res) => {
    try {
      const customers = await storage.getUsersByRole("customer");
      
      // Add metadata like order count if needed
      const customersWithMetadata = await Promise.all(
        customers.map(async (customer) => {
          const customerOrders = await storage.getOrders({ customerId: customer.id });
          return {
            ...customer,
            orderCount: customerOrders.length,
          };
        })
      );
      
      res.json(customersWithMetadata);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  
  app.get("/api/admin/suppliers", requireRole(["admin"]), async (req, res) => {
    try {
      const suppliers = await storage.getUsersByRole("supplier");
      
      // Add metadata like product count
      const suppliersWithMetadata = await Promise.all(
        suppliers.map(async (supplier) => {
          const supplierProducts = await storage.getProducts({ supplierId: supplier.id });
          return {
            ...supplier,
            productCount: supplierProducts.length,
          };
        })
      );
      
      res.json(suppliersWithMetadata);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });
  
  // Get supplier inventory details
  app.get("/api/supplier/inventory/:supplierId", requireRole(["admin", "supplier"]), async (req, res) => {
    try {
      const supplierId = parseInt(req.params.supplierId);
      
      // Check if the user has permission to access this data
      if (req.user?.role !== "admin" && req.user?.id !== supplierId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const inventory = await storage.getInventory(supplierId);
      
      // Fetch product details for each inventory item
      const inventoryWithProductDetails = await Promise.all(
        inventory.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(inventoryWithProductDetails);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // Get individual user details
  app.get("/api/users/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Paystack Payment Integration
  app.post("/api/payments/initialize", requireRole(["customer"]), async (req, res) => {
    try {
      const { amount, email, paymentMethod, orderId, callbackUrl } = req.body;
      
      if (!amount || !email || !paymentMethod) {
        return res.status(400).json({ message: "Missing required payment details" });
      }
      
      // Format amount to kobo (smallest currency unit in Ghana - 100 kobo = 1 GHS)
      const amountInKobo = Math.floor(amount * 100);
      
      // Create payment reference
      const reference = `order_${orderId || 'temp'}_${Date.now()}`;
      
      // Prepare channels based on selected payment method
      let channels: string[] = [];
      
      switch (paymentMethod) {
        case 'credit_card':
          channels = ['card'];
          break;
        case 'mtn_mobile':
          channels = ['mobile_money'];
          break;
        case 'telecel':
          channels = ['mobile_money'];
          break;
        case 'bank_transfer':
          channels = ['bank_transfer'];
          break;
        default:
          channels = ['card', 'mobile_money', 'bank_transfer']; 
      }
      
      // Check if Paystack client is properly initialized
      if (!paystackClient || !paystackClient.transaction || !paystackClient.transaction.initialize) {
        console.error("Paystack client not properly initialized or missing 'transaction.initialize' method");
        return res.status(500).json({
          success: false,
          message: "Payment service unavailable"
        });
      }
      
      // For development/testing, just return a success response with dummy values
      // This allows us to continue testing the flow without actual Paystack integration
      // Remove this in production
      const mockPaystackResponse = {
        success: true,
        authorizationUrl: `${req.protocol}://${req.get('host')}/payment-success?reference=${reference}`,
        reference: reference
      };
      
      // Return mock response
      return res.json(mockPaystackResponse);
      
      /* Uncomment this for actual Paystack integration
      try {
        const initResult = await paystackClient.transaction.initialize({
          amount: amountInKobo, 
          email,
          reference,
          callback_url: callbackUrl || `${req.protocol}://${req.get('host')}/payment-success`,
          channels,
          metadata: {
            orderId,
            userId: req.user?.id,
            paymentMethod
          }
        });
        
        if (initResult.body.status) {
          // Return authorization URL to the client
          return res.json({
            success: true,
            authorizationUrl: initResult.body.data.authorization_url,
            reference: initResult.body.data.reference
          });
        } else {
          return res.status(400).json({
            success: false,
            message: initResult.body.message
          });
        }
      } catch (error) {
        console.error("Paystack initialization error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to initialize payment"
        });
      }
      */
    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({ message: "Failed to initialize payment" });
    }
  });
  
  // Verify Paystack payment
  app.get("/api/payments/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      
      if (!reference) {
        return res.status(400).json({ message: "Payment reference is required" });
      }
      
      // Check if reference contains order ID (format: order_X_timestamp)
      const orderIdMatch = reference.match(/order_(\d+)_/);
      let orderId = null;
      
      if (orderIdMatch && orderIdMatch[1]) {
        orderId = parseInt(orderIdMatch[1]);
        
        // Update order in database if found
        const order = await storage.getOrder(orderId);
        if (order) {
          await storage.updateOrder(orderId, { 
            paymentStatus: "paid",
            status: "processing" 
          });
        }
      }
      
      // For development/testing, return a success response with mock data
      return res.json({
        success: true,
        data: {
          status: "success",
          reference: reference,
          amount: 10000, // 100.00 in the smallest currency unit
          metadata: {
            orderId: orderId,
            paymentMethod: "mtn_mobile" // or whatever was selected
          }
        }
      });
      
      /* Uncomment this for actual Paystack integration
      // Check if Paystack client is properly initialized
      if (!paystackClient || !paystackClient.transaction || !paystackClient.transaction.verify) {
        console.error("Paystack client not properly initialized or missing 'transaction.verify' method");
        return res.status(500).json({
          success: false,
          message: "Payment service unavailable"
        });
      }
      
      const verifyResult = await paystackClient.transaction.verify({ reference });
      
      if (verifyResult.body.status && verifyResult.body.data.status === "success") {
        const metadata = verifyResult.body.data.metadata;
        
        // If this is associated with an order, update the order payment status
        if (metadata && metadata.orderId) {
          const orderId = parseInt(metadata.orderId);
          const order = await storage.getOrder(orderId);
          
          if (order) {
            await storage.updateOrder(orderId, { 
              paymentStatus: "paid",
              status: "processing" 
            });
          }
        }
        
        return res.json({
          success: true,
          data: verifyResult.body.data
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
          data: verifyResult.body.data
        });
      }
      */
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to verify payment" 
      });
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
