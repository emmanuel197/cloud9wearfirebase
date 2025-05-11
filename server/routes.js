import express from "express";
import { createServer } from "http";
import { storage as dbStorage } from "./storage.js";
import { setupAuth } from "./auth.js";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  loginSchema,
  insertReviewSchema
} from "../shared/schema.js";
import { ZodError } from "zod";
import Paystack from "paystack-node";
import multer from "multer";
import path from "path";
import fs from "fs-extra";

export async function registerRoutes(app) {
  // Initialize Paystack
  let paystackClient;
  try {
    paystackClient = new Paystack(process.env.PAYSTACK_SECRET_KEY, process.env.NODE_ENV === "production");
    console.log("Paystack client successfully initialized");
  } catch (error) {
    console.log("Failed to initialize Paystack client properly");
  }

  // Set up Auth
  setupAuth(app);

  // Middleware to check user roles
  const requireRole = (roles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    };
  };

  // Handle Zod validation errors
  const handleZodError = (error, res) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map(err => ({
          path: err.path.join("."),
          message: err.message
        }))
      });
    }
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      fs.ensureDirSync(uploadDir);
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ storage });

  // Upload endpoint
  app.post("/api/upload", upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const relativePath = '/uploads/' + req.file.filename;
    res.json({ url: relativePath });
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category;
      const supplierId = req.query.supplierId ? parseInt(req.query.supplierId) : undefined;
      const isActive = req.query.isActive === 'true';

      const filters = {};
      if (category) filters.category = category;
      if (supplierId) filters.supplierId = supplierId;
      if (req.query.isActive !== undefined) filters.isActive = isActive;

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
      // Get request query parameter (used for checking if we should show mock data)
      const includeMock = req.query.includeMock !== 'false';
      
      const comingSoonProducts = await dbStorage.getProducts({ comingSoon: true });
      
      // If no coming soon products in the database and includeMock is true,
      // return the mock product for demo purposes
      if (comingSoonProducts.length === 0 && includeMock) {
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
  
  // Endpoint to delete a coming soon product
  app.delete("/api/coming-soon-products/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Special handling for mock product (ID 9999)
      if (productId === 9999) {
        // Return success but set a cookie that tells the frontend not to show the mock product
        res.cookie('hideMockComingSoonProduct', 'true', {
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
          httpOnly: false
        });
        return res.status(204).send();
      }
      
      // Verify it's a coming soon product first
      const product = await dbStorage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (!product.comingSoon) {
        return res.status(400).json({ message: "This is not a coming soon product" });
      }
      
      const deleted = await dbStorage.deleteProduct(productId);

      if (!deleted) {
        return res.status(404).json({ message: "Failed to delete product" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting coming soon product:", error);
      res.status(500).json({ message: "Failed to delete coming soon product" });
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
      const productData = { ...req.body };
      
      // If supplier is creating product, ensure supplierId is their own ID
      if (req.user?.role === "supplier") {
        productData.supplierId = req.user.id;
      }
      
      // Validate with Zod schema
      insertProductSchema.parse(productData);
      
      const product = await dbStorage.createProduct(productData);
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
      
      // Supplier can only update their own products
      if (req.user?.role === "supplier" && product.supplierId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden - You can only update your own products" });
      }
      
      const productData = { ...req.body };
      // Don't allow changing supplierId
      if (req.user?.role === "supplier") {
        productData.supplierId = req.user.id;
      }
      
      const updatedProduct = await dbStorage.updateProduct(productId, productData);
      res.json(updatedProduct);
    } catch (error) {
      handleZodError(error, res);
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
      let orders;
      
      // Filter orders based on user role
      if (req.user?.role === "customer") {
        // Customers can only see their own orders
        orders = await dbStorage.getOrders({ customerId: req.user.id });
      } else if (req.user?.role === "supplier") {
        // Suppliers can see orders containing their products
        // This is simplified; in a real app you'd need a more complex query
        const supplierProducts = await dbStorage.getProducts({ supplierId: req.user.id });
        const supplierProductIds = supplierProducts.map(p => p.id);
        
        // Get all orders
        const allOrders = await dbStorage.getOrders();
        
        // Filter orders containing supplier products
        orders = await Promise.all(allOrders.map(async order => {
          const orderItems = await dbStorage.getOrderItems(order.id);
          const hasSupplierProducts = orderItems.some(item => 
            supplierProductIds.includes(item.productId)
          );
          
          if (hasSupplierProducts) {
            // Attach items to the order
            order.items = orderItems;
            return order;
          }
          return null;
        }));
        
        // Remove null entries
        orders = orders.filter(Boolean);
      } else {
        // Admins can see all orders
        const status = req.query.status;
        orders = await dbStorage.getOrders(status ? { status } : undefined);
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
      
      // Check permissions
      if (req.user?.role === "customer" && order.customerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden - You can only view your own orders" });
      }
      
      // For suppliers, check if the order contains any of their products
      if (req.user?.role === "supplier") {
        const supplierProducts = await dbStorage.getProducts({ supplierId: req.user.id });
        const supplierProductIds = supplierProducts.map(p => p.id);
        
        const orderItems = await dbStorage.getOrderItems(orderId);
        const hasSupplierProducts = orderItems.some(item => 
          supplierProductIds.includes(item.productId)
        );
        
        if (!hasSupplierProducts) {
          return res.status(403).json({ message: "Forbidden - This order does not contain any of your products" });
        }
        
        // Attach items to the order
        order.items = orderItems;
      }
      
      // Admins and customers get the order items too
      if (req.user?.role === "admin" || req.user?.role === "customer") {
        order.items = await dbStorage.getOrderItems(orderId);
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", requireRole(["customer"]), async (req, res) => {
    try {
      // Validate order with schema
      const orderData = insertOrderSchema.parse({
        ...req.body,
        customerId: req.user.id, // Set customer ID from authenticated user
        orderDate: new Date(), // Set order date to now
        status: "pending", // Initial status
        paymentStatus: "pending" // Initial payment status
      });
      
      // Create the order
      const order = await dbStorage.createOrder(orderData);
      
      // Add order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await dbStorage.addOrderItem({
            ...item,
            orderId: order.id
          });
          
          // Reduce stock for the product
          const product = await dbStorage.getProduct(item.productId);
          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await dbStorage.updateProduct(product.id, { stock: newStock });
          }
        }
      }
      
      // Clear the user's cart
      await dbStorage.updateCart(req.user.id, []);
      
      res.status(201).json(order);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/orders/:id/status", requireRole(["admin", "supplier"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await dbStorage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // For suppliers, verify they supply at least one product in this order
      if (req.user?.role === "supplier") {
        const supplierProducts = await dbStorage.getProducts({ supplierId: req.user.id });
        const supplierProductIds = supplierProducts.map(p => p.id);
        
        const orderItems = await dbStorage.getOrderItems(orderId);
        const hasSupplierProducts = orderItems.some(item => 
          supplierProductIds.includes(item.productId)
        );
        
        if (!hasSupplierProducts) {
          return res.status(403).json({ message: "Forbidden - This order does not contain any of your products" });
        }
      }
      
      // Update the order status
      const updatedOrder = await dbStorage.updateOrder(orderId, { status });
      
      // Get the customer for this order to send them an email
      const customer = await dbStorage.getUser(order.customerId);
      
      // Only send emails if customer exists and it's not a status update from the supplier
      if (customer && req.user?.role === "admin") {
        // Import and call email service function
        const { sendOrderStatusChangeEmail } = await import('./email-service.js');
        await sendOrderStatusChangeEmail(
          customer.email,
          orderId,
          status,
          order.trackingCode
        );
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.put("/api/orders/:id/tracking", requireRole(["admin"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { trackingCode } = req.body;
      
      if (!trackingCode) {
        return res.status(400).json({ message: "Tracking code is required" });
      }
      
      const order = await dbStorage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Update the tracking code
      const updatedOrder = await dbStorage.updateOrder(orderId, { trackingCode });
      
      // Get customer to send email
      const customer = await dbStorage.getUser(order.customerId);
      if (customer) {
        // Import and call email service function
        const { sendOrderStatusChangeEmail } = await import('./email-service.js');
        await sendOrderStatusChangeEmail(
          customer.email,
          orderId,
          order.status, // Use existing status
          trackingCode // New tracking code
        );
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating tracking code:", error);
      res.status(500).json({ message: "Failed to update tracking code" });
    }
  });

  app.delete("/api/orders/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const deleted = await dbStorage.deleteOrder(orderId);

      if (!deleted) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  // Cart API
  app.get("/api/cart", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user.id;
      const cart = await dbStorage.getCart(userId);
      
      // If no cart exists yet, return empty items array
      if (!cart) {
        return res.json({ userId, items: [] });
      }
      
      // Enrich cart items with product details
      const enrichedItems = await Promise.all(cart.items.map(async (item) => {
        const product = await dbStorage.getProduct(item.productId);
        return {
          ...item,
          product
        };
      }));
      
      res.json({
        ...cart,
        items: enrichedItems
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.put("/api/cart", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (!req.body.items) {
        return res.status(400).json({ message: "Items array is required" });
      }
      
      const userId = req.user.id;
      const cart = await dbStorage.updateCart(userId, req.body.items);
      
      // Enrich cart items with product details
      const enrichedItems = await Promise.all(cart.items.map(async (item) => {
        const product = await dbStorage.getProduct(item.productId);
        return {
          ...item,
          product
        };
      }));
      
      res.json({
        ...cart,
        items: enrichedItems
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  // Supplier Inventory API
  app.get("/api/inventory", requireRole(["supplier"]), async (req, res) => {
    try {
      const supplierId = req.user.id;
      const inventory = await dbStorage.getInventory(supplierId);
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.put("/api/inventory/:productId", requireRole(["supplier"]), async (req, res) => {
    try {
      const supplierId = req.user.id;
      const productId = parseInt(req.params.productId);
      const { stock } = req.body;
      
      if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ message: "Stock must be a non-negative number" });
      }
      
      // Verify the product belongs to this supplier
      const product = await dbStorage.getProduct(productId);
      if (!product || product.supplierId !== supplierId) {
        return res.status(403).json({ message: "You can only update inventory for your own products" });
      }
      
      const updatedInventory = await dbStorage.updateInventory(supplierId, productId, stock);
      
      // Also update the product's stock
      await dbStorage.updateProduct(productId, { stock });
      
      res.json(updatedInventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });
  
  // Review API
  app.get("/api/reviews", async (req, res) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId) : undefined;
      const reviews = await dbStorage.getReviews(productId);
      
      // Enrich with product and customer details
      const enrichedReviews = await Promise.all(reviews.map(async (review) => {
        const user = await dbStorage.getUser(review.userId);
        return {
          ...review,
          user: {
            id: user.id,
            username: user.username
          }
        };
      }));
      
      res.json(enrichedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
  app.get("/api/reviews/top", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const reviews = await dbStorage.getTopReviews(limit);
      
      // Enrich with product and customer details
      const enrichedReviews = await Promise.all(reviews.map(async (review) => {
        const product = await dbStorage.getProduct(review.productId);
        const user = await dbStorage.getUser(review.userId);
        return {
          ...review,
          product: {
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrls[0]
          },
          user: {
            id: user.id,
            username: user.username
          }
        };
      }));
      
      res.json(enrichedReviews);
    } catch (error) {
      console.error("Error fetching top reviews:", error);
      res.status(500).json({ message: "Failed to fetch top reviews" });
    }
  });
  
  app.post("/api/reviews", requireRole(["customer", "admin"]), async (req, res) => {
    try {
      const reviewData = {
        ...req.body,
        userId: req.user.id,
        createdAt: new Date()
      };
      
      // Validate with schema
      insertReviewSchema.parse(reviewData);
      
      // Check if the product exists
      const product = await dbStorage.getProduct(reviewData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Create the review
      const review = await dbStorage.createReview(reviewData);
      
      // Enrich with user details
      const user = await dbStorage.getUser(review.userId);
      const enrichedReview = {
        ...review,
        user: {
          id: user.id,
          username: user.username
        }
      };
      
      res.status(201).json(enrichedReview);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.delete("/api/reviews/:id", requireRole(["admin"]), async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const deleted = await dbStorage.deleteReview(reviewId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  
  // Trending Products API
  app.get("/api/trending-products", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const trendingProducts = await dbStorage.getTrendingProducts(limit);
      res.json(trendingProducts);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      res.status(500).json({ message: "Failed to fetch trending products" });
    }
  });
  
  // Top selling products API
  app.get("/api/top-selling", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const topSellingProducts = await dbStorage.getTopSellingProducts(limit);
      res.json(topSellingProducts);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      res.status(500).json({ message: "Failed to fetch top selling products" });
    }
  });
  
  // Payment APIs
  app.post("/api/initialize-payment", requireRole(["customer"]), async (req, res) => {
    try {
      const { reference, amount, email, callback_url } = req.body;
      
      if (!paystackClient) {
        return res.status(500).json({ message: "Payment provider not available" });
      }
      
      if (!reference || !amount || !email || !callback_url) {
        return res.status(400).json({ message: "Required payment fields missing" });
      }
      
      // Initialize payment with Paystack
      const response = await paystackClient.transaction.initialize({
        reference,
        amount: Math.round(amount * 100), // Convert to lowest currency unit (kobo)
        email,
        callback_url,
        currency: "NGN" // Paystack requires NGN
      });
      
      if (response.body.status) {
        res.json({
          success: true,
          authorization_url: response.body.data.authorization_url,
          reference: response.body.data.reference
        });
      } else {
        res.status(400).json({
          success: false,
          message: response.body.message
        });
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({ message: "Failed to initialize payment" });
    }
  });
  
  app.get("/api/verify-payment/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      
      if (!paystackClient) {
        return res.status(500).json({ message: "Payment provider not available" });
      }
      
      // Verify the payment with Paystack
      const response = await paystackClient.transaction.verify(reference);
      
      if (response.body.status) {
        const paymentData = response.body.data;
        
        // If payment was successful, update order payment status
        if (paymentData.status === "success") {
          // Extract order ID from reference (assuming reference is in format orderId-timestamp)
          const orderId = parseInt(reference.split('-')[0]);
          
          if (!isNaN(orderId)) {
            await dbStorage.updateOrder(orderId, { paymentStatus: "paid" });
          }
        }
        
        res.json({
          success: true,
          data: {
            amount: paymentData.amount / 100, // Convert back from kobo to NGN
            status: paymentData.status,
            reference: paymentData.reference,
            transaction_date: paymentData.transaction_date
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: response.body.message
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}