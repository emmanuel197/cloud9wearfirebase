import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage as dbStorage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  loginSchema,
  CartItem,
  insertReviewSchema, // Added import for review schema
  OrderStatus
} from "@shared/schema";
import { ZodError } from "zod";
import Paystack from "paystack-node";
import multer from "multer";
import path from "path";
import fs from "fs-extra";
import { sendOrderStatusChangeEmail } from "./email-service";

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
  
  // Configure multer for image upload
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/products');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'product-' + uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ 
    storage: multerStorage,
    limits: { 
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Accept only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

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
      const { category, supplierId, comingSoon } = req.query;
      const filters: any = {
        isActive: true,
      };

      if (category) filters.category = category;
      if (supplierId) filters.supplierId = Number(supplierId);
      if (comingSoon !== undefined) filters.comingSoon = comingSoon === 'true';

      const products = await dbStorage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Endpoint to get coming soon products
  app.get("/api/coming-soon-products", async (req, res) => {
    try {
      const comingSoonProducts = await dbStorage.getProducts({ comingSoon: true });
      
      // If no coming soon products in the database, return the mock product for demo purposes
      if (comingSoonProducts.length === 0) {
        const mockComingSoonProduct = {
          id: 9999, // Using an ID that won't conflict with existing products
          name: "Limited Edition Collection 2025",
          description: "Our upcoming exclusive limited edition design - be the first to know when it launches!",
          price: 49.99,
          discount: 0,
          category: "t-shirts",
          imageUrls: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"],
          availableSizes: ["S", "M", "L", "XL"],
          availableColors: ["Black", "White", "Red"],
          supplierId: 2,
          stock: 0,
          isActive: false,
          comingSoon: true,
          releaseDate: new Date(2025, 5, 15) // June 15, 2025
        };
        
        return res.json([mockComingSoonProduct]);
      }
      
      res.json(comingSoonProducts);
    } catch (error) {
      console.error("Error fetching coming soon products:", error);
      res.status(500).json({ message: "Failed to fetch coming soon products" });
    }
  });
  
  // Create coming soon product
  app.post("/api/products/coming-soon", requireRole(["admin", "supplier"]), async (req, res) => {
    try {
      // Set stock to 0, isActive to false and comingSoon to true
      const productData = {
        ...req.body,
        stock: 0,
        isActive: false,
        comingSoon: true
      };
      
      // If supplier is creating product, ensure supplierId is their own ID
      if (req.user?.role === "supplier") {
        productData.supplierId = req.user.id;
      }
      
      const product = await dbStorage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Special case for our mock coming soon product
      if (productId === 9999) {
        return res.json({
          id: 9999,
          name: "Limited Edition Collection 2025",
          description: "Our upcoming exclusive limited edition design - be the first to know when it launches!",
          price: 49.99,
          discount: 0,
          category: "t-shirts",
          imageUrls: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"],
          availableSizes: ["S", "M", "L", "XL"],
          availableColors: ["Black", "White", "Red"],
          supplierId: 2,
          stock: 0,
          isActive: false,
          comingSoon: true,
          releaseDate: new Date(2025, 5, 15) // June 15, 2025
        });
      }
      
      const product = await dbStorage.getProduct(productId);

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
      // Add default false value for comingSoon if not provided 
      const productData = insertProductSchema.parse({
        ...req.body,
        comingSoon: req.body.comingSoon || false
      });

      // If supplier is creating product, ensure supplierId is their own ID
      if (req.user.role === "supplier") {
        productData.supplierId = req.user.id;
      }

      const product = await dbStorage.createProduct(productData);

      // Initialize inventory for the supplier
      await dbStorage.updateInventory(product.supplierId, product.id, product.stock);

      res.status(201).json(product);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/products/:id", requireRole(["admin", "supplier"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await dbStorage.getProduct(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Suppliers can only update their own products
      if (req.user.role === "supplier" && product.supplierId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own products" });
      }

      const updatedProduct = await dbStorage.updateProduct(productId, req.body);

      // Update inventory if stock changed
      if (req.body.stock !== undefined) {
        await dbStorage.updateInventory(product.supplierId, productId, req.body.stock);
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
      const deleted = await dbStorage.deleteProduct(productId);

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
  app.get("/api/orders", requireRole(["admin", "customer", "supplier"]), async (req, res) => {
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

      const orders = await dbStorage.getOrders(filters);

      // If supplier, include all orders - let the supplier see all orders in the system
      // This is a temporary change to ensure suppliers can see orders for testing
      if (req.user.role === "supplier") {
        // Get all products by the supplier
        const supplierProducts = await dbStorage.getProducts({ supplierId: req.user.id });
        console.log(`Found ${supplierProducts.length} products for supplier ${req.user.id}`);
        
        // Get all order items for these orders to include with the response
        const ordersWithItems = await Promise.all(
          orders.map(async (order) => {
            const orderItems = await dbStorage.getOrderItems(order.id);
            return {
              ...order,
              items: orderItems
            };
          })
        );
        
        console.log(`Returning ${ordersWithItems.length} orders to supplier ${req.user.id}`);
        return res.json(ordersWithItems);
      }

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", requireRole(["admin", "customer", "supplier"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await dbStorage.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Customers can only view their own orders
      if (req.user.role === "customer" && order.customerId !== req.user.id) {
        return res.status(403).json({ message: "You can only view your own orders" });
      }

      // Get order items
      const orderItems = await dbStorage.getOrderItems(orderId);
      
      // For each order item, get product details
      const itemsWithProducts = await Promise.all(
        orderItems.map(async (item) => {
          const product = await dbStorage.getProduct(item.productId);
          return { ...item, product };
        })
      );

      // Allow suppliers to view all orders for now (for testing)
      if (req.user.role === "supplier") {
        console.log(`Supplier ${req.user.id} viewing order ${orderId}`);
        
        // Get all products by the supplier (for debugging purposes)
        const supplierProducts = await dbStorage.getProducts({ supplierId: req.user.id });
        console.log(`Found ${supplierProducts.length} products for supplier ${req.user.id}`);
        
        // Return all order items without filtering
        return res.json({ ...order, items: itemsWithProducts });
      }

      res.json({ ...order, items: itemsWithProducts });
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
      const order = await dbStorage.createOrder(orderData);

      // Add order items
      const orderItems = req.body.items || [];
      for (const item of orderItems) {
        const orderItemData = insertOrderItemSchema.parse({
          ...item,
          orderId: order.id
        });

        await dbStorage.addOrderItem(orderItemData);

        // Update product stock
        const product = await dbStorage.getProduct(item.productId);
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await dbStorage.updateProduct(item.productId, { stock: newStock });
          await dbStorage.updateInventory(product.supplierId, product.id, newStock);
        }
      }

      // Clear user's cart
      await dbStorage.updateCart(req.user.id, []);

      res.status(201).json(order);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/orders/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await dbStorage.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await dbStorage.updateOrder(orderId, req.body);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });
  
  // Specific endpoint for updating payment status
  app.put("/api/orders/:id/payment-status", requireRole(["admin"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { paymentStatus } = req.body;
      
      if (!paymentStatus) {
        return res.status(400).json({ message: "Payment status is required" });
      }
      
      const order = await dbStorage.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await dbStorage.updateOrder(orderId, { paymentStatus });
      
      // Send email notification if payment status has changed
      if (order.paymentStatus !== paymentStatus) {
        try {
          // Get customer information
          const customer = await dbStorage.getUser(order.customerId);
          if (customer && customer.email) {
            // For now, we'll use the standard order status email with the current order status
            // In a future update, we'll implement a specific payment status email template
            await sendOrderStatusChangeEmail(
              customer.email,
              orderId,
              order.status as OrderStatus, // Cast string to OrderStatus enum
              order.deliveryTrackingCode
            );
            console.log(`Payment status change email would be sent to ${customer.email}`);
          } else {
            console.warn("Could not send payment status email: customer email not found");
          }
        } catch (emailError) {
          console.error("Failed to send payment status change email:", emailError);
        }
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  // PATCH endpoint for suppliers to update order status
  app.patch("/api/orders/:id", requireRole(["admin", "supplier"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await dbStorage.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Only allow updating order status
      if (!req.body.status) {
        return res.status(400).json({ message: "Order status is required" });
      }

      // Validate order status
      const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid order status" });
      }

      // For suppliers, temporarily allow updating any order for testing
      if (req.user?.role === "supplier") {
        console.log(`Supplier ${req.user.id} updating order ${orderId} status to ${req.body.status}`);
        // No restrictions for testing purposes
      }

      // Extra handling for shipped status to make sure it has tracking info
      const updateData: any = { status: req.body.status };
      
      // If shipped status but no tracking code was provided, use existing code or generate one
      if (req.body.status === "shipped") {
        if (req.body.deliveryTrackingCode) {
          updateData.deliveryTrackingCode = req.body.deliveryTrackingCode;
        } else if (!order.deliveryTrackingCode) {
          // Generate a random tracking code if none exists
          updateData.deliveryTrackingCode = `KSA-${Math.floor(100000 + Math.random() * 900000)}`;
        }
        
        // Set estimated delivery date to 7 days from now if not provided
        if (req.body.estimatedDeliveryDate) {
          updateData.estimatedDeliveryDate = new Date(req.body.estimatedDeliveryDate);
        } else if (!order.estimatedDeliveryDate) {
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + 7);
          updateData.estimatedDeliveryDate = deliveryDate;
        }
      }

      // Update the order with the new status and any additional data
      const updatedOrder = await dbStorage.updateOrder(orderId, updateData);
      
      // Send email notification if status changed
      if (updatedOrder && order.status !== updatedOrder.status) {
        try {
          // Import here to avoid circular dependencies
          const { sendOrderStatusChangeEmail } = await import('./email-service');
          
          // Get customer email
          const customer = await dbStorage.getUser(order.customerId);
          if (customer && customer.email) {
            console.log(`Sending order status update email to ${customer.email} for order ${orderId}`);
            await sendOrderStatusChangeEmail(
              customer.email,
              orderId,
              updatedOrder.status as any,
              updatedOrder.deliveryTrackingCode
            );
          }
        } catch (err) {
          console.error("Failed to send order status email:", err);
          // Continue with the response even if email fails
        }
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Cart API
  app.get("/api/cart", requireRole(["customer"]), async (req, res) => {
    try {
      const cart = await dbStorage.getCart(req.user.id);
      res.json(cart || { userId: req.user.id, items: [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.put("/api/cart", requireRole(["customer"]), async (req, res) => {
    try {
      const items = req.body.items as CartItem[];
      const cart = await dbStorage.updateCart(req.user.id, items);
      res.json(cart);
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  // Supplier inventory API
  app.get("/api/inventory", requireRole(["supplier"]), async (req, res) => {
    try {
      console.log(`Supplier ${req.user.id} requesting inventory`);
      
      // First get all products (temporarily show all products)
      const allProducts = await dbStorage.getProducts({ isActive: true });
      console.log(`Found ${allProducts.length} products total in system`);
      
      // Then get inventory for this supplier
      let inventory = await dbStorage.getInventory(req.user.id);
      console.log(`Found ${inventory.length} inventory entries for supplier ${req.user.id}`);
      
      // For each product in the system, make sure we have a "virtual" inventory item
      const result = allProducts.map(product => {
        // Find if we already have an inventory entry for this product
        const existingItem = inventory.find(item => item.productId === product.id);
        
        if (existingItem) {
          return existingItem;
        } else {
          // Create a virtual inventory entry
          return {
            id: -product.id, // Using negative ID to indicate virtual entry
            supplierId: req.user.id,
            productId: product.id,
            availableStock: product.stock || 0,
            updatedAt: new Date()
          };
        }
      });
      
      console.log(`Returning ${result.length} inventory items to supplier ${req.user.id}`);
      res.json(result);
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

      const product = await dbStorage.getProduct(productId);

      // Check if product exists
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Allow all suppliers to update stock for demonstration purposes
      if (req.user.role !== "supplier" && req.user.role !== "admin") {
        return res.status(403).json({ message: "You must be a supplier or admin to update inventory" });
      }
      
      // For testing purposes, always update the product stock directly
      console.log(`Supplier ${req.user.id} updating product ${productId} stock to ${stock}`);
      
      // Update product stock first
      await dbStorage.updateProduct(productId, { stock });
      
      // Then try to update the supplier inventory record if possible
      let inventory;
      try {
        inventory = await dbStorage.updateInventory(req.user.id, productId, stock);
      } catch (err) {
        console.warn(`Could not create supplier inventory record, but product was updated: ${err.message}`);
        
        // Return a virtual inventory record
        inventory = {
          id: -1, // Virtual ID
          supplierId: req.user.id,
          productId: product.id,
          availableStock: stock,
          updatedAt: new Date()
        };
      }

      res.json(inventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  // Admin users management
  app.get("/api/admin/customers", requireRole(["admin"]), async (req, res) => {
    try {
      const customers = await dbStorage.getUsersByRole("customer");

      // Add metadata like order count if needed
      const customersWithMetadata = await Promise.all(
        customers.map(async (customer) => {
          const customerOrders = await dbStorage.getOrders({ customerId: customer.id });
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
      const suppliers = await dbStorage.getUsersByRole("supplier");

      // Add metadata like product count
      const suppliersWithMetadata = await Promise.all(
        suppliers.map(async (supplier) => {
          const supplierProducts = await dbStorage.getProducts({ supplierId: supplier.id });
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

  // Endpoint to clear all orders (admin only)
  app.delete("/api/admin/orders", requireRole(["admin"]), async (req, res) => {
    try {
      // Get all orders
      const orders = await dbStorage.getOrders();

      // Delete each order
      for (const order of orders) {
        // Delete order items first
        const orderItems = await dbStorage.getOrderItems(order.id);
        // In a real database we would use transactions, but for this demo we'll loop
        for (const item of orderItems) {
          // Here we would delete the order items, but our storage interface doesn't have this method
          // For now, we'll just continue with the order deletion
        }

        // Delete the order
        await dbStorage.deleteOrder(order.id);
      }

      res.status(200).json({ message: "All orders have been cleared" });
    } catch (error) {
      console.error("Error clearing orders:", error);
      res.status(500).json({ message: "Failed to clear orders" });
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

      const inventory = await dbStorage.getInventory(supplierId);

      // Fetch product details for each inventory item
      const inventoryWithProductDetails = await Promise.all(
        inventory.map(async (item) => {
          const product = await dbStorage.getProduct(item.productId);
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
      const user = await dbStorage.getUser(userId);

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

      // Format amount to kobo (smallest currency unit in Nigeria - 100 kobo = 1 NGN)
      // Paystack's default currency is NGN, and we'll use this for payment processing
      const amountInKobo = Math.floor(amount * 100);

      // For Paystack processing, we'll use NGN which is widely supported
      const currency = "NGN";

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

        // For development/testing, continue with mock implementation
        console.log("Using mock implementation for payment initialization");
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
          currency,
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
        const order = await dbStorage.getOrder(orderId);
        if (order) {
          await dbStorage.updateOrder(orderId, { 
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
          const order = await dbStorage.getOrder(orderId);

          if (order) {
            await dbStorage.updateOrder(orderId, { 
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
      const orders = await dbStorage.getOrders();
      const products = await dbStorage.getProducts();
      const customers = await dbStorage.getUsersByRole("customer");
      const suppliers = await dbStorage.getUsersByRole("supplier");

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

  // Admin-only: Clear all orders
  app.delete("/api/admin/orders", requireRole(["admin"]), async (req, res) => {
    try {
      // Get all orders
      const orders = await dbStorage.getOrders();

      // Delete each order
      for (const order of orders) {
        await dbStorage.deleteOrder(order.id);
      }

      res.json({ success: true, message: "All orders have been deleted" });
    } catch (error) {
      console.error("Error clearing orders:", error);
      res.status(500).json({ error: "Failed to clear orders" });
    }
  });

  // Reviews API
  app.post("/api/products/:id/reviews", requireRole(["customer"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const review = insertReviewSchema.parse({
        ...req.body,
        productId,
        customerId: req.user.id,
      });

      const newReview = await dbStorage.createReview(review);
      res.status(201).json(newReview);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Get reviews for a product
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await dbStorage.getReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
  // Get top reviews for the home page
  app.get("/api/reviews/top", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const reviews = await dbStorage.getTopReviews(limit);
      
      // Get product details for each review
      const reviewsWithProducts = await Promise.all(
        reviews.map(async (review) => {
          const product = await dbStorage.getProduct(review.productId);
          const customer = await dbStorage.getUser(review.customerId);
          
          return {
            ...review,
            product: product ? { 
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrls[0] 
            } : null,
            customer: customer ? {
              id: customer.id,
              fullName: customer.fullName
            } : null
          };
        })
      );
      
      res.json(reviewsWithProducts);
    } catch (error) {
      console.error("Error fetching top reviews:", error);
      res.status(500).json({ message: "Failed to fetch top reviews" });
    }
  });

  // Admin review endpoints
  app.get("/api/admin/reviews", requireRole(["admin"]), async (req, res) => {
    try {
      const reviews = await dbStorage.getReviews();
      
      // Get product details for each review
      const reviewsWithDetails = await Promise.all(
        reviews.map(async (review) => {
          const product = await dbStorage.getProduct(review.productId);
          const customer = await dbStorage.getUser(review.customerId);
          
          return {
            ...review,
            product: product ? { 
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrls[0] 
            } : null,
            customer: customer ? {
              id: customer.id,
              fullName: customer.fullName
            } : null
          };
        })
      );
      
      res.json(reviewsWithDetails);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Delete a review (admin only)
  app.delete("/api/admin/reviews/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const deleted = await dbStorage.deleteReview(reviewId);
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  
  // Image upload endpoint
  app.post("/api/upload/product-image", requireRole(["admin", "supplier"]), upload.single('image'), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Create URL for uploaded image
      const baseUrl = req.protocol + '://' + req.get('host');
      const imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;
      
      res.status(201).json({ 
        url: imageUrl,
        filename: req.file.filename,
        message: "Image uploaded successfully" 
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  
  // Serve uploaded files statically
  app.use('/uploads', express.static('./uploads'));

  // Order tracking endpoint for customers and guests - accessible without authentication
  app.get("/api/orders/track/:trackingCode", async (req, res) => {
    try {
      const { trackingCode } = req.params;
      if (!trackingCode) {
        return res.status(400).json({ message: "Tracking code is required" });
      }
      
      // Find orders with matching tracking code
      const orders = await dbStorage.getOrders();
      const order = orders.find(o => o.deliveryTrackingCode === trackingCode);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found with this tracking code" });
      }
      
      // Get order items with product details
      const orderItems = await dbStorage.getOrderItems(order.id);
      const itemsWithProducts = await Promise.all(
        orderItems.map(async (item) => {
          const product = await dbStorage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      
      res.json({ ...order, items: itemsWithProducts });
    } catch (error) {
      console.error("Error tracking order:", error);
      res.status(500).json({ message: "Failed to track order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}