import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertOrderSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import PaymentMethodSelector from "@/components/payment-method-selector";
import PriceDisplay from "@/components/price-display";

// Extend the order schema for the checkout form
const checkoutFormSchema = z.object({
  shippingAddress: z.string().min(5, "Shipping address is required"),
  contactPhone: z.string().min(5, "Contact phone is required"),
  paymentMethod: z.enum(["credit_card", "mtn_mobile", "telecel", "bank_transfer"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { cart, clearCart, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Redirect to cart if cart is empty
  if (cart.items.length === 0 && !orderComplete) {
    return <Redirect to="/cart" />;
  }
  
  // Calculate totals
  const shippingCost = 5.00;
  const taxRate = 0.1;
  const taxAmount = total * taxRate;
  const grandTotal = total + shippingCost + taxAmount;
  
  // Form setup
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: "",
      contactPhone: "",
      paymentMethod: "credit_card",
    },
  });
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      const orderItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        priceAtPurchase: item.product.price,
      }));
      
      const orderData = {
        ...data,
        totalAmount: grandTotal,
        status: "pending",
        paymentStatus: "pending",
        items: orderItems,
      };
      
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: (data) => {
      setOrderId(data.id);
      setOrderComplete(true);
      clearCart();
      toast({
        title: t("checkout.orderSuccess.title"),
        description: t("checkout.orderSuccess.description"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("checkout.orderError.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: CheckoutFormValues) => {
    createOrderMutation.mutate(data);
  };
  
  // Order success view
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">{t("checkout.orderSuccess.title")}</CardTitle>
            <CardDescription>{t("checkout.orderSuccess.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{t("checkout.orderSuccess.orderNumber")}: <span className="font-semibold">#{orderId}</span></p>
            <p className="mb-6">{t("checkout.orderSuccess.confirmationEmail")}</p>
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  {t("checkout.orderSuccess.continueShopping")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">{t("checkout.title")}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("checkout.shippingDetails")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.form.address")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t("checkout.form.addressPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.form.phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("checkout.form.phonePlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("checkout.paymentMethod")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PaymentMethodSelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Link href="/cart">
                  <Button variant="outline" type="button">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("checkout.backToCart")}
                  </Button>
                </Link>
                
                <Button 
                  type="submit" 
                  disabled={createOrderMutation.isPending}
                  className="min-w-[150px]"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("checkout.processing")}
                    </>
                  ) : (
                    t("checkout.placeOrder")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>{t("checkout.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Order items summary */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.size}, {item.color} × {item.quantity}
                      </p>
                    </div>
                    <PriceDisplay 
                      amount={item.product.price * item.quantity} 
                      className="font-medium"
                    />
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.subtotal")}</span>
                  <PriceDisplay amount={total} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.shipping")}</span>
                  <PriceDisplay amount={shippingCost} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.tax")}</span>
                  <PriceDisplay amount={taxAmount} />
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>{t("checkout.total")}</span>
                  <PriceDisplay amount={grandTotal} className="text-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
