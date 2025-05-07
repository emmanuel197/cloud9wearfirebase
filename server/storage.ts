import { 
  User, InsertUser, Product, InsertProduct, 
  Order, InsertOrder, OrderItem, InsertOrderItem,
  Cart, InsertCart, SupplierInventory, InsertSupplierInventory,
  CartItem, UserRole
} from "@shared/schema";
import MemoryStore from "memorystore";
import session from "express-session";

// Create memory store for sessions
const SessionStore = MemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsersByRole(role: UserRole): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;

  // Product management
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(filters?: {
    category?: string;
    supplierId?: number;
    isActive?: boolean;
  }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order management
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(filters?: {
    customerId?: number;
    status?: string;
  }): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Cart management
  getCart(userId: number): Promise<Cart | undefined>;
  updateCart(userId: number, items: CartItem[]): Promise<Cart>;

  // Supplier inventory management
  getInventory(supplierId: number): Promise<SupplierInventory[]>;
  updateInventory(supplierId: number, productId: number, stock: number): Promise<SupplierInventory | undefined>;

  // Session store for authentication
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private carts: Map<number, Cart>;
  private supplierInventories: Map<number, SupplierInventory>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private cartIdCounter: number;
  private inventoryIdCounter: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.carts = new Map();
    this.supplierInventories = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.cartIdCounter = 1;
    this.inventoryIdCounter = 1;
    
    this.sessionStore = new SessionStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === role,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Product management
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(filters?: {
    category?: string;
    supplierId?: number;
    isActive?: boolean;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filters) {
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.supplierId) {
        products = products.filter(p => p.supplierId === filters.supplierId);
      }
      if (filters.isActive !== undefined) {
        products = products.filter(p => p.isActive === filters.isActive);
      }
    }
    
    return products;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order management
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(filters?: {
    customerId?: number;
    status?: string;
  }): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    
    if (filters) {
      if (filters.customerId) {
        orders = orders.filter(o => o.customerId === filters.customerId);
      }
      if (filters.status) {
        orders = orders.filter(o => o.status === filters.status);
      }
    }
    
    return orders;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const orderDate = new Date();
    const newOrder: Order = { ...order, id, orderDate };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder = { ...existingOrder, ...order };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Cart management
  async getCart(userId: number): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(
      cart => cart.userId === userId
    );
  }

  async updateCart(userId: number, items: CartItem[]): Promise<Cart> {
    let cart = await this.getCart(userId);
    
    if (!cart) {
      const id = this.cartIdCounter++;
      cart = {
        id,
        userId,
        items,
        updatedAt: new Date()
      };
    } else {
      cart = {
        ...cart,
        items,
        updatedAt: new Date()
      };
    }
    
    this.carts.set(cart.id, cart);
    return cart;
  }

  // Supplier inventory management
  async getInventory(supplierId: number): Promise<SupplierInventory[]> {
    return Array.from(this.supplierInventories.values()).filter(
      inventory => inventory.supplierId === supplierId
    );
  }

  async updateInventory(supplierId: number, productId: number, stock: number): Promise<SupplierInventory | undefined> {
    const inventory = Array.from(this.supplierInventories.values()).find(
      inv => inv.supplierId === supplierId && inv.productId === productId
    );
    
    if (!inventory) {
      const id = this.inventoryIdCounter++;
      const newInventory: SupplierInventory = {
        id,
        supplierId,
        productId,
        availableStock: stock,
        updatedAt: new Date()
      };
      this.supplierInventories.set(id, newInventory);
      return newInventory;
    }
    
    const updatedInventory: SupplierInventory = {
      ...inventory,
      availableStock: stock,
      updatedAt: new Date()
    };
    
    this.supplierInventories.set(inventory.id, updatedInventory);
    
    // Update product stock
    const product = await this.getProduct(productId);
    if (product) {
      await this.updateProduct(productId, { stock });
    }
    
    return updatedInventory;
  }

  // Initialize demo data
  private async initializeDemoData() {
    // Create demo users
    await this.createUser({
      username: "admin",
      password: "password123", // Will be hashed in auth.ts
      email: "admin@example.com",
      fullName: "Admin User",
      role: "admin"
    });

    await this.createUser({
      username: "supplier",
      password: "password123", // Will be hashed in auth.ts
      email: "supplier@example.com",
      fullName: "Supplier User",
      role: "supplier"
    });

    await this.createUser({
      username: "customer",
      password: "password123", // Will be hashed in auth.ts
      email: "customer@example.com",
      fullName: "Customer User",
      role: "customer"
    });

    // Create initial products
    const tShirt1 = await this.createProduct({
      name: "Urban Art Tee",
      description: "Premium cotton tee with exclusive urban art design",
      price: 29.99,
      category: "t-shirts",
      imageUrls: ["https://images.unsplash.com/photo-1503341733017-1901578f9f1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"],
      availableSizes: ["S", "M", "L", "XL"],
      availableColors: ["Black", "Blue", "Red"],
      supplierId: 2,
      stock: 100,
      isActive: true
    });

    const tShirt2 = await this.createProduct({
      name: "Graphic Designer Tee",
      description: "Limited edition graphic design inspired tee",
      price: 34.99,
      category: "t-shirts",
      imageUrls: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"],
      availableSizes: ["S", "M", "L", "XL"],
      availableColors: ["Gray", "White"],
      supplierId: 2,
      stock: 80,
      isActive: true
    });

    const tShirt3 = await this.createProduct({
      name: "Vintage Pattern Collection",
      description: "Classic patterns with a modern twist",
      price: 39.99,
      category: "t-shirts",
      imageUrls: ["https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"],
      availableSizes: ["S", "M", "L", "XL"],
      availableColors: ["Brown", "Green"],
      supplierId: 2,
      stock: 60,
      isActive: true
    });

    const tShirt4 = await this.createProduct({
      name: "Premium Essentials Pack",
      description: "Bundle of 3 premium basic tees - subscriber exclusive",
      price: 79.99,
      category: "t-shirts",
      imageUrls: ["https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"],
      availableSizes: ["S", "M", "L", "XL"],
      availableColors: ["Black", "White", "Gray"],
      supplierId: 2,
      stock: 40,
      isActive: true
    });

    // Initialize supplier inventory
    await this.updateInventory(2, tShirt1.id, 100);
    await this.updateInventory(2, tShirt2.id, 80);
    await this.updateInventory(2, tShirt3.id, 60);
    await this.updateInventory(2, tShirt4.id, 40);
  }
}

export const storage = new MemStorage();
