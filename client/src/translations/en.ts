const translations = {
  navigation: {
    home: "Home",
    products: "Products",
    admin: "Admin",
    supplier: "Supplier",
    cart: "Cart",
    login: "Login",
    logout: "Logout",
    adminDashboard: "Admin Dashboard",
    supplierDashboard: "Supplier Dashboard",
    mobileMenuDescription: "Navigation menu",
    language: "Language"
  },
  
  hero: {
    title: "Subscribe to Exclusive Content",
    subtitle: "Join our membership program for unique designs, early access, and special discounts.",
    browseButton: "Browse Products",
    registerButton: "Register"
  },
  
  featuredProducts: {
    title: "Featured Products",
    subtitle: "Discover our trending designs and exclusive collections",
    viewAllButton: "View All Products"
  },
  
  subscriptions: {
    title: "Subscription Plans",
    subtitle: "Choose a membership plan that works for you",
    subscribeButton: "Subscribe Now",
    
    basic: {
      title: "Basic",
      description: "Perfect for casual fans",
      benefits: {
        discount: "10% discount on all products",
        earlyAccess: "Early access to new releases",
        newsletter: "Monthly newsletter"
      },
      nonBenefits: {
        collections: "Member-only collections",
        shipping: "Free shipping"
      }
    },
    
    premium: {
      popular: "Most Popular",
      title: "Premium",
      description: "Best value for enthusiasts",
      benefits: {
        discount: "20% discount on all products",
        earlyAccess: "Early access to new releases",
        newsletter: "Exclusive monthly newsletter",
        collections: "Member-only collections",
        shipping: "Free shipping on orders over $50"
      }
    },
    
    vip: {
      title: "VIP",
      description: "For true collectors",
      benefits: {
        discount: "30% discount on all products",
        earlyAccess: "Early access to new releases",
        newsletter: "Premium newsletter with industry insights",
        collections: "Member-only collections and limited editions",
        shipping: "Free shipping on all orders",
        support: "VIP customer support"
      }
    }
  },
  
  payment: {
    title: "Flexible Payment Options",
    subtitle: "Choose the payment method that works best for you",
    
    creditCard: {
      title: "Credit Card",
      description: "Secure payment with major credit cards",
      badge: "Secure Payment"
    },
    
    mobileMoney: {
      title: "MTN Mobile Money",
      description: "Pay directly with MTN Mobile Money"
    },
    
    telecel: {
      title: "Telecel",
      description: "Pay with Telecel mobile payment"
    },
    
    bankTransfer: {
      title: "Bank Transfer",
      description: "Direct bank transfer to our account",
      badge: "Secure Transfer"
    }
  },
  
  cta: {
    title: "Ready to Join Our Exclusive Community?",
    description: "Get access to premium content, special discounts, and early product releases. Join thousands of satisfied members today.",
    signupButton: "Choose a Plan",
    exploreButton: "Learn More"
  },
  
  footer: {
    description: "Premium content and exclusive designs for our global community of fashion enthusiasts.",
    quickLinks: "Quick Links",
    support: "Support",
    contact: "Contact Us",
    rights: "All rights reserved.",
    
    links: {
      home: "Home",
      products: "Products",
      about: "About Us",
      contact: "Contact"
    },
    
    supportLinks: {
      faq: "FAQs",
      shipping: "Shipping & Returns",
      returns: "Size Guide", 
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    }
  },
  
  auth: {
    login: {
      tabTitle: "Login",
      title: "Welcome Back",
      description: "Enter your credentials to access your account",
      username: "Username",
      password: "Password",
      submit: "Sign In",
      loggingIn: "Signing in...",
      registerLink: "Don't have an account? Register"
    },
    
    register: {
      tabTitle: "Register",
      title: "Create Account",
      description: "Register to get exclusive access and benefits",
      fullName: "Full Name",
      email: "Email",
      username: "Username",
      password: "Password",
      role: "I am a:",
      customerRole: "Customer",
      supplierRole: "Supplier",
      submit: "Create Account",
      creatingAccount: "Creating account...",
      loginLink: "Already have an account? Login"
    },
    
    hero: {
      title: "Welcome to ExclusiveWear",
      subtitle: "Your premium destination for unique designer clothing",
      benefit1: "Access to exclusive designs not available elsewhere",
      benefit2: "Early access to new releases before the general public",
      benefit3: "Special discounts and member-only promotions",
      benefit4: "Free shipping options and global delivery"
    }
  },
  
  products: {
    title: "All Products",
    searchPlaceholder: "Search products...",
    categoryFilter: "Filter by category",
    allCategories: "All Categories",
    sortBy: "Sort by",
    sortOptions: {
      latest: "Latest",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      popular: "Popular"
    },
    outOfStock: "Out of Stock",
    quickAdd: "Quick Add",
    quickAddTitle: "Add to Cart",
    size: "Size",
    color: "Color",
    selectSize: "Select size",
    selectColor: "Select color",
    selectOptions: "Please select size and color",
    addToCart: "Add to Cart",
    cancel: "Cancel",
    addedToCart: "Product added to cart",
    noResults: {
      title: "No products found",
      message: "Try changing your search or filter criteria"
    }
  },
  
  productDetail: {
    size: "Size",
    color: "Color",
    quantity: "Quantity",
    inStock: "in stock",
    selectSize: "Select size",
    selectColor: "Select color",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    shipping: "Free shipping on orders over $50",
    category: "Category",
    
    validation: {
      sizeRequired: "Please select a size",
      colorRequired: "Please select a color"
    },
    
    addedToCart: "Added to cart successfully",
    
    tabs: {
      details: "Product Details",
      sizing: "Size Guide",
      shipping: "Shipping Info",
      detailsTitle: "Product Details",
      sizingTitle: "Size Chart",
      shippingTitle: "Shipping Information",
      shippingInfo: "We ship worldwide with tracking available for all orders. Standard delivery takes 5-7 business days, while express delivery is 2-3 business days.",
      shippingNote: "Due to COVID-19, some deliveries may experience slight delays. We appreciate your patience."
    },
    
    notFound: {
      title: "Product Not Found",
      message: "The product you are looking for does not exist or has been removed.",
      backButton: "Back to Products"
    }
  },
  
  cart: {
    title: "Your Shopping Cart",
    empty: {
      title: "Your cart is empty",
      message: "Looks like you haven't added any products to your cart yet.",
      browseButton: "Browse Products"
    },
    items: "Cart Items",
    clearButton: "Clear Cart",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax (10%)",
    total: "Total",
    checkoutButton: "Proceed to Checkout",
    size: "Size",
    remove: "Remove",
    
    promoAlert: {
      title: "Free Shipping",
      description: "Enjoy free shipping on orders over $50!"
    },
    
    notifications: {
      added: "Item added to cart",
      removed: "Item removed from cart",
      cleared: "Cart has been cleared"
    }
  },
  
  checkout: {
    title: "Checkout",
    shippingDetails: "Shipping Details",
    paymentMethod: "Payment Method",
    backToCart: "Back to Cart",
    placeOrder: "Place Order",
    processing: "Processing...",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax (10%)",
    total: "Total",
    
    form: {
      address: "Shipping Address",
      addressPlaceholder: "Enter your full shipping address",
      phone: "Contact Phone",
      phonePlaceholder: "Enter your phone number"
    },
    
    payment: {
      creditCard: {
        title: "Credit Card",
        description: "Pay securely with your credit card"
      },
      mtnMobile: {
        title: "MTN Mobile Money",
        description: "Pay with your MTN Mobile Money account"
      },
      telecel: {
        title: "Telecel",
        description: "Pay with your Telecel account"
      },
      bankTransfer: {
        title: "Bank Transfer",
        description: "Pay via bank transfer (processing takes 1-2 business days)"
      }
    },
    
    orderSuccess: {
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase",
      orderNumber: "Order Number",
      confirmationEmail: "We've sent a confirmation email with your order details.",
      continueShopping: "Continue Shopping"
    },
    
    orderError: {
      title: "Error placing order",
      tryAgain: "Please try again later"
    }
  },
  
  admin: {
    refresh: "Refresh",
    
    sidebar: {
      adminPanel: "Admin",
      dashboard: "Dashboard",
      orders: "Orders",
      products: "Products",
      customers: "Customers",
      suppliers: "Suppliers",
      settings: "Settings",
      storefront: "Visit Store",
      logout: "Logout"
    },
    
    customers: {
      title: "Customer Management",
      description: "View and manage customer accounts",
      customerDetails: "Customer Details",
      view: "View Details",
      memberSince: "Member since {date}",
      noCustomers: "No customers found",
      noCustomersDesc: "There are no customer accounts registered yet.",
      fetchError: "Error fetching customer data",
      
      table: {
        id: "ID",
        name: "Name",
        email: "Email",
        joined: "Joined",
        orders: "Orders",
        actions: "Actions"
      }
    },
    
    suppliers: {
      title: "Supplier Management",
      description: "View and manage supplier accounts",
      supplierDetails: "Supplier Details",
      view: "View Details",
      memberSince: "Member since {date}",
      product: "Product",
      products: "Products",
      noSuppliers: "No suppliers found",
      noSuppliersDesc: "There are no supplier accounts registered yet.",
      fetchError: "Error fetching supplier data",
      inventory: "Inventory",
      inventoryDescription: "Current product stock levels",
      noInventory: "No inventory data",
      noInventoryDesc: "This supplier hasn't added any products to their inventory yet.",
      stock: "Stock",
      unknownCategory: "Uncategorized",
      
      table: {
        id: "ID",
        name: "Name",
        email: "Email",
        products: "Products",
        joined: "Joined",
        actions: "Actions"
      }
    },
    
    dashboard: {
      title: "Admin Dashboard",
      salesAnalytics: "Sales Analytics",
      salesDescription: "Track your sales performance over time",
      recentOrders: "Recent Orders",
      recentOrdersDescription: "Latest customer orders",
      
      stats: {
        sales: "Total Sales",
        orders: "Total Orders",
        customers: "Customers",
        products: "Products"
      },
      
      orders: {
        id: "ID",
        customer: "Customer",
        amount: "Amount",
        status: "Status",
        date: "Date"
      }
    },
    
    chart: {
      sales: "Sales",
      orders: "Orders"
    },
    
    orders: {
      title: "Order Management",
      description: "Manage and track customer orders",
      filterByStatus: "Filter by status",
      allOrders: "All Orders",
      view: "View",
      orderDetails: "Order Details #{id}",
      customerInfo: "Customer Information",
      orderInfo: "Order Information",
      items: "Items",
      total: "Total",
      address: "Shipping Address",
      phone: "Contact Phone",
      status: "Status",
      payment: "Payment Method",
      paymentStatus: "Payment Status",
      updateStatus: "Update Status",
      selectStatus: "Select status",
      update: "Update",
      addTracking: "Add Tracking Information",
      trackingPlaceholder: "Enter tracking code",
      markShipped: "Mark as Shipped",
      trackingInfo: "Tracking Information",
      trackingCode: "Tracking Code",
      estimatedDelivery: "Estimated Delivery",
      noOrders: "No orders found",
      noOrdersDesc: "There are no orders matching the current filters.",
      updateSuccess: "Order updated successfully",
      updateError: "Failed to update order",
      fetchError: "Failed to fetch order details",
      trackingRequired: "Tracking code is required to mark as shipped",
      
      statuses: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled"
      },
      
      table: {
        id: "Order ID",
        customer: "Customer",
        amount: "Amount",
        status: "Status",
        date: "Date",
        actions: "Actions"
      }
    },
    
    products: {
      title: "Product Management",
      description: "Manage your product catalog",
      filterByCategory: "Filter by category",
      allCategories: "All Categories",
      add: "Add Product",
      addFirst: "Add First Product",
      edit: "Edit",
      delete: "Delete",
      active: "Active",
      inactive: "Inactive",
      actions: "Actions",
      noProducts: "No products found",
      noProductsDesc: "There are no products in your catalog yet.",
      
      addProduct: "Add New Product",
      editProduct: "Edit Product",
      addDescription: "Create a new product in your catalog",
      editDescription: "Modify existing product details",
      saving: "Saving...",
      saveButton: "Save Product",
      updateButton: "Update Product",
      cancel: "Cancel",
      deleteConfirmTitle: "Delete Product?",
      deleteConfirmDesc: "This action cannot be undone. The product will be permanently removed from your catalog.",
      confirmDelete: "Yes, Delete",
      
      addSuccess: "Product added successfully",
      addSuccessDesc: "Your new product has been added to the catalog",
      updateSuccess: "Product updated successfully",
      updateSuccessDesc: "Your product has been updated",
      deleteSuccess: "Product deleted successfully",
      deleteSuccessDesc: "The product has been removed from your catalog",
      addError: "Failed to add product",
      updateError: "Failed to update product",
      deleteError: "Failed to delete product",
      
      form: {
        name: "Product Name",
        price: "Price",
        category: "Category",
        selectCategory: "Select a category",
        stock: "Stock",
        supplier: "Supplier ID",
        active: "Active",
        activeDescription: "This product will be visible in the store",
        description: "Description",
        images: "Product Images",
        imageUrl: "Image URL",
        addImage: "Add Image",
        sizes: "Available Sizes",
        sizePlaceholder: "Size (e.g. S, M, L, XL)",
        addSize: "Add Size",
        colors: "Available Colors",
        colorPlaceholder: "Color (e.g. Red, Blue, Black)",
        addColor: "Add Color"
      },
      
      table: {
        id: "ID",
        name: "Product Name",
        price: "Price",
        category: "Category",
        stock: "Stock",
        status: "Status",
        actions: "Actions"
      }
    }
  },
  
  supplier: {
    sidebar: {
      supplierPanel: "Supplier",
      dashboard: "Dashboard",
      inventory: "Inventory",
      analytics: "Analytics",
      storefront: "Visit Store",
      logout: "Logout"
    },
    
    dashboard: {
      title: "Supplier Dashboard",
      welcome: "Welcome, {name}",
      welcomeMessage: "Manage your inventory and track your product performance",
      lowStockTitle: "Low Stock Products",
      lowStockDesc: "Products that need attention",
      allStocked: "All products well-stocked",
      allStockedDesc: "You have no products with low inventory levels",
      quickActions: "Quick Actions",
      manageInventory: "Manage Inventory",
      tips: "Supplier Tips",
      tip1: "Keep your inventory updated to avoid stockouts",
      tip2: "Add high-quality images to increase product appeal",
      tip3: "Respond quickly to low stock notifications",
      
      stats: {
        totalProducts: "Total Products",
        lowStock: "Low Stock",
        needsAttention: "Needs attention",
        totalStock: "Total Stock"
      },
      
      products: {
        id: "Product ID",
        stock: "Stock",
        lastUpdated: "Last Updated"
      }
    },
    
    inventory: {
      title: "Inventory Management",
      description: "Manage your product inventory levels",
      search: "Search inventory...",
      refresh: "Refresh",
      update: "Update",
      updateSuccess: "Inventory updated successfully",
      updateError: "Failed to update inventory",
      noProducts: "No products found",
      noProductsDesc: "You don't have any products in your inventory yet.",
      lowStock: "Low Stock",
      id: "ID",
      availableSizes: "Sizes",
      availableColors: "Colors",
      stock: "Stock"
    }
  },
  
  dataTable: {
    search: "Search...",
    noResults: "No results found",
    showing: "Showing",
    of: "of",
    previous: "Previous",
    next: "Next"
  }
};

export default translations;
