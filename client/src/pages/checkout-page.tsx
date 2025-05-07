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
import { PaystackButton } from "@/components/paystack-button";

// Extend the order schema for the checkout form
const checkoutFormSchema = z.object({
  shippingAddress: z.string().min(5, "Shipping address is required"),
  contactPhone: z.string().min(5, "Contact phone is required"),
  paymentMethod: z.enum(["credit_card", "mtn_mobile", "telecel", "bank_transfer"], {
    required_error: "Please select a payment method",
  }),
  customerEmail: z.string().email("Valid email is required for payment"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { cart, clearCart, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Redirect to cart if cart is empty
  if (cart.items.length === 0 && !orderComplete && !paymentInitialized) {
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
      customerEmail: user?.email || "",
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
      // Instead of completing the order immediately, initiate payment
      initializePayment(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: t("checkout.orderError.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Initialize payment with Paystack
  const initializePaymentMutation = useMutation({
    mutationFn: async ({ amount, email, paymentMethod, orderId }: { 
      amount: number;
      email: string;
      paymentMethod: string;
      orderId: number;
    }) => {
      const res = await apiRequest("POST", "/api/payments/initialize", {
        amount,
        email,
        paymentMethod,
        orderId,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setPaymentReference(data.reference);
      setPaymentData(data);
      setPaymentInitialized(true);
    },
    onError: (error: Error) => {
      toast({
        title: t("checkout.paymentError.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Verify payment status
  const verifyPaymentMutation = useMutation({
    mutationFn: async (reference: string) => {
      const res = await apiRequest("GET", `/api/payments/verify/${reference}`);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setOrderComplete(true);
        clearCart();
        toast({
          title: t("checkout.orderSuccess.title"),
          description: t("checkout.orderSuccess.description"),
        });
      } else {
        toast({
          title: t("checkout.paymentError.title"),
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: t("checkout.paymentError.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const initializePayment = (orderId: number) => {
    const formValues = form.getValues();
    initializePaymentMutation.mutate({
      amount: grandTotal,
      email: formValues.customerEmail,
      paymentMethod: formValues.paymentMethod,
      orderId,
    });
  };
  
  const handlePaymentSuccess = (reference: string) => {
    verifyPaymentMutation.mutate(reference);
  };
  
  const onSubmit = (data: CheckoutFormValues) => {
    createOrderMutation.mutate(data);
  };
  
  // Payment view
  if (paymentInitialized && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("checkout.payment.title")}</CardTitle>
            <CardDescription>{t("checkout.payment.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold mb-2">{t("checkout.orderSummary")}</h3>
              <div className="flex justify-between mb-2">
                <span>{t("checkout.subtotal")}</span>
                <PriceDisplay amount={total} />
              </div>
              <div className="flex justify-between mb-2">
                <span>{t("checkout.shipping")}</span>
                <PriceDisplay amount={shippingCost} />
              </div>
              <div className="flex justify-between mb-2">
                <span>{t("checkout.tax")}</span>
                <PriceDisplay amount={taxAmount} />
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>{t("checkout.total")}</span>
                <PriceDisplay amount={grandTotal} className="text-lg" />
              </div>
            </div>
            
            <div className="space-y-4">
              <PaystackButton
                amount={grandTotal}
                email={form.getValues().customerEmail}
                onSuccess={handlePaymentSuccess}
                paymentMethod={form.getValues().paymentMethod}
                metadata={{
                  orderId: orderId,
                  cartItems: cart.items.length,
                }}
                className="mt-6"
              />
              
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentInitialized(false)} 
                  className="mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("checkout.backToCheckout")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
                  <CardTitle>{t("checkout.customerDetails")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.form.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t("checkout.form.emailPlaceholder")} {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("checkout.form.emailDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            
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
                  disabled={createOrderMutation.isPending || initializePaymentMutation.isPending}
                  className="min-w-[150px]"
                >
                  {(createOrderMutation.isPending || initializePaymentMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("checkout.processing")}
                    </>
                  ) : (
                    t("checkout.proceedToPayment")
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
                
                <div className="mt-4 text-sm text-gray-500 border-t pt-4">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    Note: Prices are displayed in Ghana Cedis (GHS) but payment will be processed in Nigerian Naira (NGN) to ensure payment compatibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
