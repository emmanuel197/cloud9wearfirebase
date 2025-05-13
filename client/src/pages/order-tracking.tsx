import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Helmet } from "react-helmet";
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle,
  Search,
  ShoppingBag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function OrderTrackingPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchType, setSearchType] = useState<"orderId" | "tracking">("orderId");
  const [searchValue, setSearchValue] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Fetch customer's orders if logged in
  const { data: userOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch(`/api/orders?customerId=${user.id}`);
      if (!res.ok) return [];
      return await res.json();
    },
    enabled: !!user,
  });

  // Query for searching an order
  const { data: searchedOrder, isLoading: isSearchingOrder } = useQuery({
    queryKey: ["/api/orders/search", searchType, searchValue],
    queryFn: async () => {
      if (!searchValue || !searchSubmitted) return null;
      
      const endpoint = searchType === "orderId" 
        ? `/api/orders/${searchValue}` 
        : `/api/orders/tracking/${searchValue}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) return null;
      return await res.json();
    },
    enabled: searchSubmitted && !!searchValue,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-purple-500" />;
      case "delivered":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const renderOrderTimeline = (order: any) => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentStatusIndex = statuses.indexOf(order.status);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{t("customer.order.timeline")}</h3>
        
        {order.status === "cancelled" ? (
          <div className="bg-red-50 p-4 rounded-md border border-red-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <div>
                <h4 className="font-medium text-red-700">{t("customer.order.cancelled")}</h4>
                <p className="text-sm text-red-600">{t("customer.order.cancelledDesc")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {statuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={status} className={`relative pl-10 pb-8 ${index === statuses.length - 1 ? 'pb-0' : ''}`}>
                  <div className={cn(
                    "absolute left-0 rounded-full p-2 flex items-center justify-center",
                    isCompleted ? "bg-primary text-white" : "bg-gray-200"
                  )}>
                    {isCompleted ? (
                      index === currentStatusIndex ? (
                        getStatusIcon(status)
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  
                  <div className={cn("ml-2", isCurrent && "font-medium")}>
                    <h4 className={cn(
                      "text-base capitalize",
                      isCompleted ? "text-gray-900" : "text-gray-500"
                    )}>
                      {t(`customer.order.statuses.${status}`)}
                    </h4>
                    
                    {isCurrent && order.status === "shipped" && order.trackingCode && (
                      <div className="mt-2 text-sm">
                        <p>
                          <span className="font-medium">{t("customer.order.trackingCode")}: </span>
                          {order.trackingCode}
                        </p>
                        {order.estimatedDelivery && (
                          <p>
                            <span className="font-medium">{t("customer.order.estimatedDelivery")}: </span>
                            {order.estimatedDelivery}
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

  const renderOrderDetails = (order: any) => {
    if (!order) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t("customer.order.details")}</h2>
            <p className="text-gray-500">
              {t("customer.order.orderDate", { date: format(new Date(order.orderDate), "PPP") })}
            </p>
          </div>
          
          <Badge className="text-sm capitalize">
            {getStatusIcon(order.status)}
            <span className="ml-1">{t(`customer.order.statuses.${order.status}`)}</span>
          </Badge>
        </div>
        
        {renderOrderTimeline(order)}
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {order.address && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t("customer.order.shippingInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{order.address}</p>
                {order.phone && <p className="mt-2">{order.phone}</p>}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("customer.order.paymentInfo")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("checkout.paymentMethod")}:</span>
                  <span className="font-medium capitalize">{order.paymentMethod?.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("customer.order.paymentStatus")}:</span>
                  <Badge variant="outline" className={order.paymentStatus === "paid" ? "bg-green-50 text-green-700 border-green-200" : ""}>
                    {t(`customer.order.paymentStatus.${order.paymentStatus}`)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("customer.order.items")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <div className="text-sm text-gray-500 mt-1">
                        <span>{t("customer.order.size")}: {item.size}</span>
                        <span className="mx-2">•</span>
                        <span>{t("customer.order.color")}: {item.color}</span>
                        <span className="mx-2">•</span>
                        <span>{t("customer.order.quantity")}: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="font-medium">
                    ₵{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("customer.order.total")}</span>
                <span className="text-xl font-bold">₵{parseFloat(order.amount).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSearchResults = () => {
    if (!searchSubmitted) return null;
    
    if (isSearchingOrder) {
      return (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }
    
    if (!searchedOrder) {
      return (
        <div className="text-center my-12">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold">{t("customer.trackOrder.notFound")}</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {t("customer.trackOrder.notFoundDesc")}
          </p>
        </div>
      );
    }
    
    return renderOrderDetails(searchedOrder);
  };

  const renderCustomerOrders = () => {
    if (isLoadingOrders) {
      return (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }
    
    if (!userOrders || userOrders.length === 0) {
      return (
        <div className="text-center my-12">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold">{t("customer.trackOrder.noOrders")}</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {t("customer.trackOrder.noOrdersDesc")}
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">
              {t("customer.trackOrder.shopNow")}
            </Link>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userOrders.map((order: any) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-1">
                    Order #{order.id}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(order.orderDate), "PPP")}
                  </p>
                </div>
                <Badge className="capitalize">
                  {t(`customer.order.statuses.${order.status}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">{t("customer.order.items")}</span>
                  <span className="font-medium">{order.items?.length || 0}</span>
                </div>
                
                {/* Display order items summary */}
                <div className="mb-3 border-t border-b py-2 mt-2">
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm py-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate max-w-[180px]">
                              {item.product?.name || "Product"} 
                              <span className="text-gray-500">
                                {" × "}{item.quantity}
                              </span>
                            </span>
                          </div>
                          <span className="font-medium">
                            ₵{((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-2">
                      {t("customer.order.noItems")}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-500">{t("customer.order.total")}</span>
                  <span className="font-medium">
                    ₵{order.totalAmount && !isNaN(parseFloat(order.totalAmount)) 
                      ? parseFloat(order.totalAmount).toFixed(2)
                      : (order.amount && !isNaN(parseFloat(order.amount)) 
                         ? parseFloat(order.amount).toFixed(2) 
                         : '0.00')}
                  </span>
                </div>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full mt-2"
                >
                  <Link href={`/order-tracking/${order.id}`}>
                    {t("customer.trackOrder.viewDetails")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-12">
      <Helmet>
        <title>Order Tracking | Cloud9wear</title>
        <meta name="description" content="Track your Cloud9wear orders and check their current status." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-2">{t("customer.trackOrder.title")}</h1>
      <p className="text-gray-500 mb-8 max-w-2xl">
        {t("customer.trackOrder.description")}
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="orderId" onValueChange={(v) => setSearchType(v as any)}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="orderId">
                  {t("customer.trackOrder.byOrderId")}
                </TabsTrigger>
                <TabsTrigger value="tracking">
                  {t("customer.trackOrder.byTracking")}
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <TabsContent value="orderId">
                  <Input
                    type="text"
                    placeholder={t("customer.trackOrder.orderIdPlaceholder")}
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setSearchSubmitted(false);
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="tracking">
                  <Input
                    type="text"
                    placeholder={t("customer.trackOrder.trackingCodePlaceholder")}
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setSearchSubmitted(false);
                    }}
                  />
                </TabsContent>
                
                <Button type="submit" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  {t("customer.trackOrder.search")}
                </Button>
              </form>
            </Tabs>
            
            {renderSearchResults()}
          </CardContent>
        </Card>
        
        {user && (
          <div>
            <h2 className="text-xl font-bold mb-4">{t("customer.trackOrder.yourOrders")}</h2>
            {renderCustomerOrders()}
          </div>
        )}
      </div>
    </div>
  );
}