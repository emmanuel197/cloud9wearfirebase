import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  AlertCircle,
  Home,
  Phone,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import PriceDisplay from "@/components/price-display";

export default function OrderTracking() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [activeTab, setActiveTab] = useState("byOrderId");

  // Fetch customer orders if logged in
  const {
    data: customerOrders = [],
    isLoading: isLoadingOrders,
  } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetch("/api/orders").then((res) => res.json());
    },
    enabled: !!user,
  });

  // Fetch single order by ID or tracking code
  const {
    data: searchedOrder,
    isLoading: isLoadingSearch,
    refetch: refetchOrder,
    error,
  } = useQuery({
    queryKey: ["/api/orders/track", orderIdInput || trackingCode],
    queryFn: async () => {
      if (!orderIdInput && !trackingCode) return null;

      let url;
      if (activeTab === "byOrderId" && orderIdInput) {
        url = `/api/orders/${orderIdInput}`;
      } else if (activeTab === "byTracking" && trackingCode) {
        url = `/api/orders/track/${trackingCode}`;
      } else {
        return null;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Order not found");
      }
      return res.json();
    },
    enabled: false,
  });

  const handleSearch = () => {
    refetchOrder();
  };

  // Get status icon and color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "bg-yellow-100 text-yellow-800",
          label: t("customer.order.statuses.pending"),
        };
      case "processing":
        return {
          icon: <Package className="h-5 w-5" />,
          color: "bg-blue-100 text-blue-800",
          label: t("customer.order.statuses.processing"),
        };
      case "shipped":
        return {
          icon: <Truck className="h-5 w-5" />,
          color: "bg-purple-100 text-purple-800",
          label: t("customer.order.statuses.shipped"),
        };
      case "delivered":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-green-100 text-green-800",
          label: t("customer.order.statuses.delivered"),
        };
      case "cancelled":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: "bg-red-100 text-red-800",
          label: t("customer.order.statuses.cancelled"),
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "bg-gray-100 text-gray-800",
          label: status,
        };
    }
  };

  // Order status timeline component
  const OrderTimeline = ({ order }: { order: any }) => {
    const steps = [
      { status: "pending", label: t("customer.order.statuses.pending") },
      { status: "processing", label: t("customer.order.statuses.processing") },
      { status: "shipped", label: t("customer.order.statuses.shipped") },
      { status: "delivered", label: t("customer.order.statuses.delivered") },
    ];

    // Get current step index
    const getCurrentStepIndex = () => {
      if (order.status === "cancelled") return -1;
      return steps.findIndex((step) => step.status === order.status);
    };

    const currentStep = getCurrentStepIndex();

    return (
      <div className="my-8">
        <h3 className="text-lg font-medium mb-4">{t("customer.order.timeline")}</h3>
        
        {order.status === "cancelled" ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>{t("customer.order.cancelled")}</AlertTitle>
            <AlertDescription>
              {t("customer.order.cancelledDesc")}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={step.status} className="relative flex items-start mb-8 last:mb-0">
                  <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted 
                      ? "bg-primary border-primary text-white" 
                      : "bg-white border-gray-300"
                  }`}>
                    {isCompleted ? (
                      index === currentStep ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <p className={`font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-gray-900" : "text-gray-500"}`}>
                      {step.label}
                    </p>
                    
                    {isCurrent && step.status === "shipped" && order.deliveryTrackingCode && (
                      <div className="mt-1 text-sm">
                        <p>
                          {t("customer.order.trackingCode")}: <span className="font-medium">{order.deliveryTrackingCode}</span>
                        </p>
                        {order.estimatedDeliveryDate && (
                          <p className="text-gray-600 mt-1">
                            {t("customer.order.estimatedDelivery")}: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Order details component
  const OrderDetails = ({ order }: { order: any }) => {
    const statusDetails = getStatusDetails(order.status);
    
    return (
      <Card className="mt-8 dark-mode-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-on-dark">{t("customer.order.details")}</CardTitle>
              <CardDescription className="text-subtle-on-dark">
                {t("customer.order.orderDate", { date: new Date(order.orderDate).toLocaleDateString() })}
              </CardDescription>
            </div>
            <Badge className={statusDetails.color}>
              <span className="flex items-center gap-1">
                {statusDetails.icon}
                {statusDetails.label}
              </span>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 text-on-dark">
          <OrderTimeline order={order} />
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">{t("customer.order.shippingInfo")}</h3>
            <div className="flex items-start gap-2">
              <Home className="h-4 w-4 mt-1 text-gray-400" />
              <p>{order.shippingAddress}</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <p>{order.contactPhone}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">{t("customer.order.paymentInfo")}</h3>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <p>{order.paymentMethod}</p>
            </div>
            <Badge variant="outline" className="mt-2">
              {order.paymentStatus === "paid" ? (
                <span className="text-green-600">{t("customer.order.paymentStatus.paid")}</span>
              ) : (
                <span className="text-yellow-600">{t("customer.order.paymentStatus.pending")}</span>
              )}
            </Badge>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-3">{t("customer.order.items")}</h3>
            
            <div className="space-y-4">
              {order.items && order.items.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4 pb-3 border-b border-border">
                  {item.product?.imageUrls && item.product.imageUrls.length > 0 ? (
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.product.imageUrls[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.product?.name || `Product ID: ${item.productId}`}
                    </p>
                    <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                      <span>{t("customer.order.size")}: {item.size}</span>
                      <span>•</span>
                      <span>{t("customer.order.color")}: {item.color}</span>
                      <span>•</span>
                      <span>{t("customer.order.quantity")}: {item.quantity}</span>
                    </div>
                    <p className="mt-1 font-medium">
                      <PriceDisplay amount={item.priceAtPurchase * item.quantity} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center font-medium text-lg">
              <span>{t("customer.order.total")}</span>
              <PriceDisplay amount={order.totalAmount} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container py-10 flex-1">
        <h1 className="text-3xl font-bold mb-2">{t("customer.trackOrder.title")}</h1>
        <p className="text-gray-600 mb-8">{t("customer.trackOrder.description")}</p>
        
        <Tabs defaultValue="byOrderId" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="byOrderId">{t("customer.trackOrder.byOrderId")}</TabsTrigger>
            <TabsTrigger value="byTracking">{t("customer.trackOrder.byTracking")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="byOrderId" className="mt-4">
            <div className="flex max-w-md gap-2">
              <Input
                placeholder={t("customer.trackOrder.orderIdPlaceholder")}
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
              <Button onClick={handleSearch} disabled={!orderIdInput || isLoadingSearch}>
                {isLoadingSearch ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {t("customer.trackOrder.search")}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="byTracking" className="mt-4">
            <div className="flex max-w-md gap-2">
              <Input
                placeholder={t("customer.trackOrder.trackingCodePlaceholder")}
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
              <Button onClick={handleSearch} disabled={!trackingCode || isLoadingSearch}>
                {isLoadingSearch ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {t("customer.trackOrder.search")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {error ? (
          <Alert variant="destructive" className="mb-8 max-w-3xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("customer.trackOrder.notFound")}</AlertTitle>
            <AlertDescription>
              {t("customer.trackOrder.notFoundDesc")}
            </AlertDescription>
          </Alert>
        ) : searchedOrder ? (
          <OrderDetails order={searchedOrder} />
        ) : null}
        
        {user && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">{t("customer.trackOrder.yourOrders")}</h2>
            
            {isLoadingOrders ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : customerOrders.length > 0 ? (
              <div className="space-y-4">
                <Accordion type="single" collapsible className="max-w-3xl">
                  {customerOrders.map((order: any) => {
                    const statusDetails = getStatusDetails(order.status);
                    
                    return (
                      <AccordionItem key={order.id} value={order.id.toString()}>
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center">
                              <Badge className={statusDetails.color}>
                                <span className="flex items-center gap-1">
                                  {statusDetails.icon}
                                  {statusDetails.label}
                                </span>
                              </Badge>
                              <span className="ml-4 text-sm">Order #{order.id}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </span>
                              <PriceDisplay amount={order.totalAmount} />
                            </div>
                          </div>
                        </AccordionTrigger>
                        
                        <AccordionContent>
                          <OrderDetails order={order} />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ) : (
              <Card className="max-w-3xl">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">{t("customer.trackOrder.noOrders")}</h3>
                  <p className="text-gray-500 mb-4">
                    {t("customer.trackOrder.noOrdersDesc")}
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/">{t("customer.trackOrder.shopNow")}</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}