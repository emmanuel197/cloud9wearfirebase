import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { 
  Package, 
  ArrowLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function OrderDetailPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/order-tracking/:id");
  const orderId = params?.id;

  // Query for the specific order
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["/api/orders", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }
        return await res.json();
      } catch (err) {
        console.error("Error fetching order:", err);
        return null;
      }
    },
    enabled: !!orderId,
  });

  // Check if user has permission to view this order
  useEffect(() => {
    if (order && user && order.customerId !== user.id && user.role !== "admin" && user.role !== "supplier") {
      // Redirect if the order doesn't belong to this user and they're not an admin or supplier
      setLocation("/order-tracking");
    }
  }, [order, user, setLocation]);

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order || error) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-2">{t("customer.trackOrder.notFound")}</h1>
        <p className="text-gray-500 mb-6">
          {t("customer.trackOrder.notFoundDesc")}
        </p>
        <Button asChild variant="outline">
          <Link href="/order-tracking">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("customer.trackOrder.title")}
          </Link>
        </Button>
      </div>
    );
  }

  // Create a simplified version of order details for this page
  const renderOrderDetails = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h2 className="text-xl font-medium">{t("customer.order.details")}</h2>
            <p className="text-gray-500">
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <Badge variant="outline" className="capitalize">
              {t(`customer.order.statuses.${order.status}`)}
            </Badge>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
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
                  <span className="text-gray-500">{t("checkout.total")}:</span>
                  <span className="font-bold">₵{parseFloat(order.amount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-12">
      <Helmet>
        <title>Order #{orderId} | Cloud9wear</title>
        <meta name="description" content={`Details for your order #${orderId} from Cloud9wear.`} />
      </Helmet>
      
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/order-tracking">
                {t("customer.trackOrder.title")}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>
              Order #{orderId}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Button asChild variant="outline" className="mb-8">
        <Link href="/order-tracking">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("customer.trackOrder.title")}
        </Link>
      </Button>
      
      {/* Render order details - we would import this from a shared component in a real app */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order #{orderId}</h1>
            <p className="text-gray-500">
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}
            </p>
          </div>
        </div>
        
        {/* Render the order details */}
        {renderOrderDetails()}
      </div>
    </div>
  );
}