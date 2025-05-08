import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Authentication schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
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
  category: text("category").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  availableSizes: text("available_sizes").array().notNull(),
  availableColors: text("available_colors").array().notNull(),
  supplierId: integer("supplier_id").notNull(),
  stock: integer("stock").notNull().default(0),
  discount: doublePrecision("discount").default(0),
  isActive: boolean("is_active").notNull().default(true),
  comingSoon: boolean("coming_soon").notNull().default(false),
  releaseDate: timestamp("release_date"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Order schemas
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  contactPhone: text("contact_phone").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  orderDate: timestamp("order_date").defaultNow(),
  deliveryTrackingCode: text("delivery_tracking_code"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true,
});

// Order items schemas
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  priceAtPurchase: doublePrecision("price_at_purchase").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Cart schemas
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  items: jsonb("items").notNull().$type<CartItem[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  updatedAt: true,
});

// Supplier inventory schemas
export const supplierInventory = pgTable("supplier_inventory", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull(),
  productId: integer("product_id").notNull().unique(),
  availableStock: integer("available_stock").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupplierInventorySchema = createInsertSchema(supplierInventory).omit({
  id: true,
  updatedAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type SupplierInventory = typeof supplierInventory.$inferSelect;
export type InsertSupplierInventory = z.infer<typeof insertSupplierInventorySchema>;

// Reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  customerId: integer("customer_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Additional custom types
export type CartItem = {
  productId: number;
  quantity: number;
  size: string;
  color: string;
};

export type PaymentMethod = "credit_card" | "mtn_mobile" | "telecel" | "bank_transfer";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type UserRole = "customer" | "supplier" | "admin";

// Extended schemas for validation
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
