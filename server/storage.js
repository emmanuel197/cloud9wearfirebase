import { 
  users, products, orders, orderItems, carts, supplierInventory, reviews
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, desc } from 'drizzle-orm';
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db.js";

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

class DatabaseStorage {
  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUsersByRole(role) {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProducts(filters = {}) {
    let query = db.select().from(products);
    
    if (filters.category) {
      query = query.where(eq(products.category, filters.category));
    }
    
    if (filters.supplierId) {
      query = query.where(eq(products.supplierId, filters.supplierId));
    }
    
    if (filters.isActive !== undefined) {
      query = query.where(eq(products.isActive, filters.isActive));
    }
    
    if (filters.comingSoon !== undefined) {
      query = query.where(eq(products.comingSoon, filters.comingSoon));
    }
    
    return await query;
  }

  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id, product) {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id) {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return !!deletedProduct;
  }

  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrders(filters = {}) {
    let query = db.select().from(orders);
    
    if (filters.customerId) {
      query = query.where(eq(orders.customerId, filters.customerId));
    }
    
    if (filters.status) {
      query = query.where(eq(orders.status, filters.status));
    }
    
    return await query;
  }

  async createOrder(order) {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id, order) {
    const [updatedOrder] = await db
      .update(orders)
      .set(order)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async deleteOrder(id) {
    const [deletedOrder] = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning();
    return !!deletedOrder;
  }

  async getOrderItems(orderId) {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async addOrderItem(orderItem) {
    const [newOrderItem] = await db
      .insert(orderItems)
      .values(orderItem)
      .returning();
    return newOrderItem;
  }

  async getCart(userId) {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));
    return cart;
  }

  async updateCart(userId, items) {
    // Try to get existing cart
    const existingCart = await this.getCart(userId);
    
    if (existingCart) {
      // Update existing cart
      const [updatedCart] = await db
        .update(carts)
        .set({ items, updatedAt: new Date() })
        .where(eq(carts.userId, userId))
        .returning();
      return updatedCart;
    } else {
      // Create new cart
      const [newCart] = await db
        .insert(carts)
        .values({
          userId,
          items,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newCart;
    }
  }

  async getInventory(supplierId) {
    return await db
      .select()
      .from(supplierInventory)
      .where(eq(supplierInventory.supplierId, supplierId));
  }

  async updateInventory(supplierId, productId, stock) {
    // Check if inventory entry exists
    const [existingInventory] = await db
      .select()
      .from(supplierInventory)
      .where(
        and(
          eq(supplierInventory.supplierId, supplierId),
          eq(supplierInventory.productId, productId)
        )
      );
    
    if (existingInventory) {
      // Update existing inventory
      const [updatedInventory] = await db
        .update(supplierInventory)
        .set({ stock, updatedAt: new Date() })
        .where(
          and(
            eq(supplierInventory.supplierId, supplierId),
            eq(supplierInventory.productId, productId)
          )
        )
        .returning();
      return updatedInventory;
    } else {
      // Create new inventory entry
      const [newInventory] = await db
        .insert(supplierInventory)
        .values({
          supplierId,
          productId,
          stock,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newInventory;
    }
  }

  async createReview(review) {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviews(productId) {
    if (productId) {
      return await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .orderBy(desc(reviews.createdAt));
    } else {
      return await db
        .select()
        .from(reviews)
        .orderBy(desc(reviews.createdAt));
    }
  }

  async getTopReviews(limit = 5) {
    return await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.rating))
      .limit(limit);
  }

  async deleteReview(id) {
    const [deletedReview] = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning();
    return !!deletedReview;
  }

  async getTrendingProducts(limit = 4) {
    // In a real app, this would be based on analytics or order data
    // For demo purposes, just get the newest active products
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.id))
      .limit(limit);
  }

  async getTopSellingProducts(limit = 4) {
    // In a real app, this would be based on order quantities
    // For demo purposes, just get some active products
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .limit(limit);
  }

  async initializeDemoData() {
    try {
      // Check if we already have users
      const existingUsers = await db.select().from(users);
      if (existingUsers.length > 0) {
        console.log("Demo data already exists");
        return;
      }
      
      // Create demo users
      const adminUser = await this.createUser({
        username: "admin",
        email: "admin@example.com",
        password: "$2b$10$EduiF8r3S9UYa0X8rJSxXujdK1RmYC/qbV3Pdxc01BCM3yjQbVKvG", // password123
        role: "admin",
        createdAt: new Date()
      });
      
      const supplierUser = await this.createUser({
        username: "supplier",
        email: "supplier@example.com",
        password: "$2b$10$EduiF8r3S9UYa0X8rJSxXujdK1RmYC/qbV3Pdxc01BCM3yjQbVKvG", // password123
        role: "supplier",
        createdAt: new Date()
      });
      
      const customerUser = await this.createUser({
        username: "customer",
        email: "customer@example.com",
        password: "$2b$10$EduiF8r3S9UYa0X8rJSxXujdK1RmYC/qbV3Pdxc01BCM3yjQbVKvG", // password123
        role: "customer",
        createdAt: new Date()
      });
      
      // Create demo products
      const product1 = await this.createProduct({
        name: "Premium Cotton T-Shirt",
        description: "High-quality cotton t-shirt with a comfortable fit",
        price: 29.99,
        discount: 0,
        category: "t-shirts",
        imageUrls: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
        ],
        availableSizes: ["S", "M", "L", "XL"],
        availableColors: ["Black", "White", "Navy"],
        supplierId: supplierUser.id,
        stock: 100,
        isActive: true,
        comingSoon: false
      });
      
      const product2 = await this.createProduct({
        name: "Graphic Print Hoodie",
        description: "Warm hoodie with custom graphic design",
        price: 49.99,
        discount: 10,
        category: "hoodies",
        imageUrls: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
        ],
        availableSizes: ["M", "L", "XL", "XXL"],
        availableColors: ["Black", "Gray"],
        supplierId: supplierUser.id,
        stock: 75,
        isActive: true,
        comingSoon: false
      });
      
      // Create demo order
      const order = await this.createOrder({
        customerId: customerUser.id,
        orderDate: new Date(),
        status: "processing",
        paymentStatus: "paid",
        shippingAddress: "123 Main St, Anytown, AN 12345",
        billingAddress: "123 Main St, Anytown, AN 12345",
        total: 79.98,
        trackingCode: "TRACK123456"
      });
      
      // Add order items
      await this.addOrderItem({
        orderId: order.id,
        productId: product1.id,
        quantity: 1,
        size: "M",
        color: "Black",
        price: product1.price
      });
      
      await this.addOrderItem({
        orderId: order.id,
        productId: product2.id,
        quantity: 1,
        size: "L",
        color: "Gray",
        price: product2.price * 0.9 // Apply discount
      });
      
      // Create customer cart
      await this.updateCart(customerUser.id, [
        {
          productId: product1.id,
          quantity: 1,
          size: "M",
          color: "Black"
        }
      ]);
      
      // Add supplier inventory
      await this.updateInventory(supplierUser.id, product1.id, 100);
      await this.updateInventory(supplierUser.id, product2.id, 75);
      
      // Add reviews
      await this.createReview({
        productId: product1.id,
        userId: customerUser.id,
        rating: 5,
        comment: "Great quality t-shirt! Fits perfectly.",
        createdAt: new Date()
      });
      
      await this.createReview({
        productId: product2.id,
        userId: customerUser.id,
        rating: 4,
        comment: "Love the design, but runs a bit small.",
        createdAt: new Date()
      });
      
      console.log("Demo data initialized successfully");
    } catch (error) {
      console.error("Error initializing demo data:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();