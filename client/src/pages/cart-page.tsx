import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/cart-item";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export default function CartPage() {
  const { cart, clearCart, total } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // If not logged in as customer, redirect to auth page
    if (user && user.role !== "customer") {
      navigate("/");
    }
  }, [user, navigate]);
  
  if (!cart.items.length) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("cart.empty.title")}</h1>
          <p className="text-gray-500 mb-8">{t("cart.empty.message")}</p>
          <Link href="/products">
            <Button className="mx-auto">
              <ShoppingBag className="mr-2 h-4 w-4" />
              {t("cart.empty.browseButton")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">{t("cart.title")}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">{t("cart.items")} ({cart.items.length})</h2>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                {t("cart.clearButton")}
              </Button>
            </div>
            <div>
              {cart.items.map((item, index) => (
                <div key={`${item.productId}-${item.size}-${item.color}`}>
                  <CartItem item={item} />
                  {index < cart.items.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("cart.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.subtotal")}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.shipping")}</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.tax")}</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>{t("cart.total")}</span>
                  <span>${(total + 5 + total * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout">
                <Button className="w-full">
                  {t("cart.checkoutButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Promotional Info */}
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("cart.promoAlert.title")}</AlertTitle>
            <AlertDescription>
              {t("cart.promoAlert.description")}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
