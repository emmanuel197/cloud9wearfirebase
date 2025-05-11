import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Authentication schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Product schemas
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  discount: doublePrecision("discount").default(0).notNull(),
  category: text("category").notNull(),
  imageUrls: jsonb("image_urls").notNull().$type(),
  availableSizes: jsonb("available_sizes").notNull().$type(),
  availableColors: jsonb("available_colors").notNull().$type(),
  supplierId: integer("supplier_id").notNull().references(() => users.id),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  comingSoon: boolean("coming_soon").notNull().default(false),
  releaseDate: timestamp("release_date"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true
});

// Order schemas
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  orderDate: timestamp("order_date").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  shippingAddress: text("shipping_address").notNull(),
  billingAddress: text("billing_address").notNull(),
  total: doublePrecision("total").notNull(),
  trackingCode: text("tracking_code"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true,
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  price: doublePrecision("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Cart schemas
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  items: jsonb("items").notNull().$type(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Supplier inventory schemas
export const supplierInventory = pgTable("supplier_inventory", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSupplierInventorySchema = createInsertSchema(supplierInventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  userId: integer("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// Helper types for cart and order
export const validPaymentMethods = ["credit_card", "mtn_mobile", "telecel", "bank_transfer"];
export const validOrderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
export const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
export const validUserRoles = ["customer", "supplier", "admin"];