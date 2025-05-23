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
  paymentMethod: z.enum(
    ["credit_card", "mtn_mobile", "telecel", "bank_transfer"],
    {
      required_error: "Please select a payment method",
    },
  ),
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
  const shippingCost = 5.0;
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
      const orderItems = cart.items.map((item) => ({
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
    mutationFn: async ({
      amount,
      email,
      paymentMethod,
      orderId,
    }: {
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
      console.log("yeah");
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
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle className="text-2xl text-black">
              {t("Checkout")}
            </CardTitle>
            <CardDescription className="text-gray-700">
              {t("Complete Your Payment")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-gray-50 rounded-md text-black">
              <h3 className="font-semibold mb-2 text-black">
                {t("checkout.orderSummary")}
              </h3>
              <div className="flex justify-between mb-2 text-gray-800">
                <span>{t("checkout.subtotal")}</span>
                <PriceDisplay amount={total} className="text-black" />
              </div>
              {/* Show savings from discounts if applicable */}
              {cart.items.some(item => item.product.discount && item.product.discount > 0) && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>{t("checkout.savings")}</span>
                  <span>-{cart.items.reduce((sum, item) => {
                    return item.product.discount && item.product.discount > 0
                      ? sum + (item.product.price * Math.round(item.product.discount) / 100 * item.quantity)
                      : sum;
                  }, 0).toFixed(2)} GHS</span>
                </div>
              )}
              <div className="flex justify-between mb-2 text-gray-800">
                <span>{t("checkout.shipping")}</span>
                <PriceDisplay amount={shippingCost} className="text-black" />
              </div>
              <div className="flex justify-between mb-2 text-gray-800">
                <span>{t("checkout.tax")}</span>
                <PriceDisplay amount={taxAmount} className="text-black" />
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-black">
                <span>{t("checkout.total")}</span>
                <PriceDisplay amount={grandTotal} className="text-lg text-black" />
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
                  className="mt-4 text-black border-gray-300 hover:bg-gray-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("Back To Checkout")}
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
        <Card className="text-center bg-white text-black">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-black">
              {t("checkout.orderSuccess.title")}
            </CardTitle>
            <CardDescription className="text-gray-700">
              {t("checkout.orderSuccess.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-800">
              {t("checkout.orderSuccess.orderNumber")}:{" "}
              <span className="font-semibold text-black">#{orderId}</span>
            </p>
            <p className="mb-6 text-gray-800">
              {t("checkout.orderSuccess.confirmationEmail")}
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="text-black border-gray-300 hover:bg-gray-100">
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
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">{t("Customer Details")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">{t("Email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("Email Placeholder")}
                            {...field}
                            className="text-black placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-600">
                          {t("Email Description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">{t("checkout.shippingDetails")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">{t("checkout.form.address")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("checkout.form.addressPlaceholder")}
                            {...field}
                            className="text-black placeholder:text-gray-500"
                          />
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
                        <FormLabel className="text-gray-800">{t("checkout.form.phone")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("checkout.form.phonePlaceholder")}
                            {...field}
                            className="text-black placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">{t("checkout.paymentMethod")}</CardTitle>
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
                  <Button variant="outline" type="button" className="text-black border-gray-300 hover:bg-gray-100">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("checkout.backToCart")}
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={
                    createOrderMutation.isPending ||
                    initializePaymentMutation.isPending
                  }
                  className="min-w-[150px]"
                >
                  {createOrderMutation.isPending ||
                  initializePaymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("checkout.processing")}
                    </>
                  ) : (
                    t("Proceed To Payment")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4 dark-mode-card">
            <CardHeader>
              <CardTitle className="text-on-dark">{t("checkout.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Order items summary */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex justify-between"
                  >
                    <div>
                      <p className="font-medium text-on-dark">{item.product.name}</p>
                      <p className="text-sm text-subtle-on-dark">
                        {item.size}, {item.color} × {item.quantity}
                      </p>
                    </div>
                    {item.product.discount ? (
                      <div className="flex flex-col items-end">
                        <PriceDisplay 
                          amount={item.product.price * (1 - Math.round(item.product.discount) / 100) * item.quantity}
                          className="font-medium text-on-dark" 
                        />
                        <PriceDisplay 
                          amount={item.product.price * item.quantity}
                          className="text-sm line-through text-gray-400" 
                        />
                      </div>
                    ) : (
                      <PriceDisplay
                        amount={item.product.price * item.quantity}
                        className="font-medium text-on-dark"
                      />
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-subtle-on-dark">
                    {t("checkout.subtotal")}
                  </span>
                  <PriceDisplay amount={total} className="text-on-dark" />
                </div>
                <div className="flex justify-between">
                  <span className="text-subtle-on-dark">
                    {t("checkout.shipping")}
                  </span>
                  <PriceDisplay amount={shippingCost} className="text-on-dark" />
                </div>
                <div className="flex justify-between">
                  <span className="text-subtle-on-dark">{t("checkout.tax")}</span>
                  <PriceDisplay amount={taxAmount} className="text-on-dark" />
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span className="text-on-dark">{t("checkout.total")}</span>
                  <PriceDisplay amount={grandTotal} className="text-lg text-on-dark" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
