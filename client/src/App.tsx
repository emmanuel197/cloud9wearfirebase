import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminProducts from "@/pages/admin/products";
import SupplierDashboard from "@/pages/supplier/dashboard";
import SupplierInventory from "@/pages/supplier/inventory";
import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      
      {/* Protected customer routes */}
      <Route path="/cart">
        <ProtectedRoute roles={["customer"]}>
          <CartPage />
        </ProtectedRoute>
      </Route>
      <Route path="/checkout">
        <ProtectedRoute roles={["customer"]}>
          <CheckoutPage />
        </ProtectedRoute>
      </Route>
      
      {/* Protected admin routes */}
      <Route path="/admin">
        <ProtectedRoute roles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/orders">
        <ProtectedRoute roles={["admin"]}>
          <AdminOrders />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/products">
        <ProtectedRoute roles={["admin"]}>
          <AdminProducts />
        </ProtectedRoute>
      </Route>
      
      {/* Protected supplier routes */}
      <Route path="/supplier">
        <ProtectedRoute roles={["supplier"]}>
          <SupplierDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/supplier/inventory">
        <ProtectedRoute roles={["supplier"]}>
          <SupplierInventory />
        </ProtectedRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class">
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
