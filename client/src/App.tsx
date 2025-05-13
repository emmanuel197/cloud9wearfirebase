import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
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
import PaymentSuccessPage from "@/pages/payment-success-page";
import OrderTrackingPage from "@/pages/order-tracking";
import OrderDetailPage from "@/pages/order-detail";
import AboutPage from "@/pages/about-page";
import FAQPage from "@/pages/faq-page";
import ContactPage from "@/pages/contact-page";
import PrivacyPage from "@/pages/privacy-page";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminProducts from "@/pages/admin/products";
import AdminCustomers from "@/pages/admin/customers";
import AdminSuppliers from "@/pages/admin/suppliers";
import AdminComingSoon from "@/pages/admin/coming-soon-page";
import AdminReviews from "@/pages/admin/reviews";
import SupplierDashboard from "@/pages/supplier/dashboard";
import SupplierInventory from "@/pages/supplier/inventory";
import SupplierOrders from "@/pages/supplier/orders";
import SupplierAddProducts from "@/pages/supplier/add-products";
import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function App() {
  return (
    <ThemeProvider attribute="class">
      <TooltipProvider>
        <div className="flex flex-col min-h-screen w-full">
          <div className="w-full">
            <Header />
          </div>
          <main className="flex-grow mx-auto w-full max-w-[1980px] px-[clamp(1rem,3vw,2rem)]">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/auth" component={AuthPage} />
              <Route path="/products" component={ProductsPage} />
              <Route path="/products/:id" component={ProductDetailPage} />
              <Route path="/cart" component={CartPage} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/payment-success" component={PaymentSuccessPage} />
              <Route path="/order-tracking" component={OrderTrackingPage} />
              <Route path="/order-tracking/:id" component={OrderDetailPage} />
              <Route path="/track-order" component={OrderTrackingPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/faq" component={FAQPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/privacy" component={PrivacyPage} />
              <Route path="/admin" component={() => <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/orders" component={() => <ProtectedRoute roles={["admin"]}><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/products" component={() => <ProtectedRoute roles={["admin"]}><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/coming-soon" component={() => <ProtectedRoute roles={["admin"]}><AdminComingSoon /></ProtectedRoute>} />
              <Route path="/admin/reviews" component={() => <ProtectedRoute roles={["admin"]}><AdminReviews /></ProtectedRoute>} />
              <Route path="/admin/customers" component={() => <ProtectedRoute roles={["admin"]}><AdminCustomers /></ProtectedRoute>} />
              <Route path="/admin/suppliers" component={() => <ProtectedRoute roles={["admin"]}><AdminSuppliers /></ProtectedRoute>} />
              <Route path="/supplier" component={() => <ProtectedRoute roles={["supplier"]}><SupplierDashboard /></ProtectedRoute>} />
              <Route path="/supplier/inventory" component={() => <ProtectedRoute roles={["supplier"]}><SupplierInventory /></ProtectedRoute>} />
              <Route path="/supplier/add-products" component={() => <ProtectedRoute roles={["supplier"]}><SupplierAddProducts /></ProtectedRoute>} />
              <Route path="/supplier/orders" component={() => <ProtectedRoute roles={["supplier"]}><SupplierOrders /></ProtectedRoute>} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <div className="w-full">
            <Footer />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;