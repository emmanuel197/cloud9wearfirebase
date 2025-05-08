import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import SupplierSidebar from "@/components/supplier/sidebar";
import { DataTable } from "@/components/ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Filter, Truck, Package, Clock, Eye } from "lucide-react";
import PriceDisplay from "@/components/price-display";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { OrderStatus } from "@shared/schema";

export default function SupplierOrders() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch all orders
  const { data: orders = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/orders"],
  });
  
  // Function to fetch a specific order
  const handleViewOrder = async (orderId: number) => {
    try {
      const response = await apiRequest("GET", `/api/orders/${orderId}`);
      const orderData = await response.json();
      setSelectedOrder(orderData);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: t("supplier.orders.fetchError"),
        description: t("supplier.orders.fetchErrorDesc"),
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== "supplier") {
    return null; // Protected by ProtectedRoute component
  }

  // Function to update order status
  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await apiRequest("PATCH", `/api/orders/${orderId}`, { status });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: t("supplier.orders.statusUpdateSuccess"),
        description: t("supplier.orders.statusUpdateSuccessDesc"),
      });
    } catch (error) {
      toast({
        title: t("supplier.orders.statusUpdateError"),
        description: t("supplier.orders.statusUpdateErrorDesc"),
        variant: "destructive",
      });
    }
  };

  // Filter orders by status
  const filteredOrders = orders.filter((order: any) => {
    if (!statusFilter) return true;
    return order.status === statusFilter;
  });

  // Columns for orders table
  const orderColumns = [
    {
      accessorKey: "id",
      header: t("supplier.orders.table.id"),
      size: 60,
    },
    {
      accessorKey: "customerName",
      header: t("supplier.orders.table.customer"),
      cell: ({ row }: any) => {
        const customerId = row.original.customerId;
        const customerEmail = row.original.customerEmail || "N/A";
        return (
          <div>
            <div className="font-medium">{customerEmail}</div>
            <div className="text-xs text-muted-foreground">ID: {customerId}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "orderDate",
      header: t("supplier.orders.table.date"),
      cell: ({ row }: any) => {
        const date = new Date(row.original.orderDate);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "totalAmount",
      header: t("supplier.orders.table.amount"),
      cell: ({ row }: any) => {
        return <PriceDisplay amount={row.original.totalAmount} />;
      },
    },
    {
      accessorKey: "status",
      header: t("supplier.orders.table.status"),
      cell: ({ row }: any) => {
        const status = row.original.status;
        let color;
        switch (status) {
          case "pending":
            color = "bg-yellow-100 text-yellow-800";
            break;
          case "processing":
            color = "bg-blue-100 text-blue-800";
            break;
          case "shipped":
            color = "bg-purple-100 text-purple-800";
            break;
          case "delivered":
            color = "bg-green-100 text-green-800";
            break;
          case "cancelled":
            color = "bg-red-100 text-red-800";
            break;
          default:
            color = "bg-gray-100 text-gray-800";
        }

        return (
          <Badge className={color} variant="outline">
            {t(`supplier.orders.status.${status}`)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: t("supplier.orders.table.payment"),
      cell: ({ row }: any) => {
        const paymentStatus = row.original.paymentStatus;
        let color;
        switch (paymentStatus) {
          case "paid":
            color = "bg-green-100 text-green-800";
            break;
          case "pending":
            color = "bg-yellow-100 text-yellow-800";
            break;
          case "failed":
            color = "bg-red-100 text-red-800";
            break;
          default:
            color = "bg-gray-100 text-gray-800";
        }

        return (
          <Badge className={color} variant="outline">
            {t(`supplier.orders.payment.${paymentStatus}`)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: t("supplier.orders.table.actions"),
      cell: ({ row }: any) => {
        const order = row.original;
        const isPaid = order.paymentStatus === "paid";
        const isCancelled = order.status === "cancelled";
        const isDelivered = order.status === "delivered";

        return (
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleViewOrder(order.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t("supplier.orders.view")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>{t("supplier.orders.orderDetails", { id: selectedOrder?.id })}</DialogTitle>
                  <DialogDescription>
                    {selectedOrder && new Date(selectedOrder.orderDate).toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedOrder ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-medium mb-1">{t("supplier.orders.customerInfo")}</h3>
                        <p>ID: {selectedOrder.customerId}</p>
                        <p>{t("supplier.orders.address")}: {selectedOrder.shippingAddress}</p>
                        <p>{t("supplier.orders.phone")}: {selectedOrder.contactPhone}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{t("supplier.orders.orderInfo")}</h3>
                        <p>
                          {t("supplier.orders.status")}: 
                          <Badge className={`ml-2 ${
                            selectedOrder.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            selectedOrder.status === "processing" ? "bg-blue-100 text-blue-800" :
                            selectedOrder.status === "shipped" ? "bg-purple-100 text-purple-800" :
                            selectedOrder.status === "delivered" ? "bg-green-100 text-green-800" :
                            selectedOrder.status === "cancelled" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`} variant="outline">
                            {selectedOrder.status}
                          </Badge>
                        </p>
                        <p>{t("supplier.orders.payment")}: {selectedOrder.paymentMethod}</p>
                        <p>
                          {t("supplier.orders.paymentStatus")}: 
                          <Badge className={`ml-2 ${
                            selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
                            selectedOrder.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`} variant="outline">
                            {selectedOrder.paymentStatus}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">{t("supplier.orders.items")}</h3>
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">Product ID: {item.productId}</p>
                            <p className="text-sm text-gray-500">
                              {item.size}, {item.color} × {item.quantity}
                            </p>
                          </div>
                          <PriceDisplay 
                            amount={item.priceAtPurchase * item.quantity}
                            className="font-medium" 
                          />
                        </div>
                      ))}
                      
                      <div className="flex justify-between mt-4 font-semibold">
                        <span>{t("supplier.orders.total")}</span>
                        <PriceDisplay amount={selectedOrder.totalAmount} className="font-semibold" />
                      </div>
                    </div>
                    
                    {!isCancelled && !isDelivered && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">{t("supplier.orders.updateStatus")}</h3>
                          <div className="flex space-x-2">
                            {order.status === "pending" && isPaid && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "processing")}
                              >
                                <Package className="mr-1 h-4 w-4" />
                                {t("supplier.orders.actions.startProcessing")}
                              </Button>
                            )}
                            
                            {order.status === "processing" && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "shipped")}
                              >
                                <Truck className="mr-1 h-4 w-4" />
                                {t("supplier.orders.actions.markShipped")}
                              </Button>
                            )}
                            
                            {order.status === "shipped" && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "delivered")}
                              >
                                <Clock className="mr-1 h-4 w-4" />
                                {t("supplier.orders.actions.markDelivered")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </DialogContent>
            </Dialog>
            
            {/* Status update buttons */}
            {!isCancelled && !isDelivered && (
              <>
                {order.status === "pending" && isPaid && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, "processing")}
                  >
                    <Package className="mr-1 h-4 w-4" />
                    {t("supplier.orders.actions.startProcessing")}
                  </Button>
                )}
                
                {order.status === "processing" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, "shipped")}
                  >
                    <Truck className="mr-1 h-4 w-4" />
                    {t("supplier.orders.actions.markShipped")}
                  </Button>
                )}
                
                {order.status === "shipped" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    {t("supplier.orders.actions.markDelivered")}
                  </Button>
                )}
                
                {order.status === "pending" && !isPaid && (
                  <span className="text-sm text-gray-500">
                    {t("supplier.orders.waitingForPayment")}
                  </span>
                )}
              </>
            )}
            
            {(isCancelled || isDelivered) && (
              <span className="text-sm text-gray-500">
                {t("supplier.orders.noActionsAvailable")}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  // Create tabs for different order statuses
  const tabContent = (tabStatus: string) => {
    const filteredByStatus = orders.filter((order: any) => {
      if (!tabStatus || tabStatus === "all") return true;
      return order.status === tabStatus;
    });

    // Function to capitalize first letter safely
    const capitalizeFirst = (str: string): string => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Generate view description key
    const getViewDescription = (status: string): string => {
      if (status === "all") return "supplier.orders.viewAllOrders";
      return `supplier.orders.view${capitalizeFirst(status)}Orders`;
    };

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>
              {tabStatus === "all"
                ? t("supplier.orders.allOrders")
                : t(`supplier.orders.status.${tabStatus}Orders`)}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select
                onValueChange={(value) => setStatusFilter(value !== "all" ? value : null)}
                defaultValue="all"
              >
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder={t("supplier.orders.filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("supplier.orders.allStatuses")}</SelectItem>
                  <SelectItem value="pending">{t("supplier.orders.status.pending")}</SelectItem>
                  <SelectItem value="processing">{t("supplier.orders.status.processing")}</SelectItem>
                  <SelectItem value="shipped">{t("supplier.orders.status.shipped")}</SelectItem>
                  <SelectItem value="delivered">{t("supplier.orders.status.delivered")}</SelectItem>
                  <SelectItem value="cancelled">{t("supplier.orders.status.cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            {t(getViewDescription(tabStatus))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredByStatus.length > 0 ? (
            <DataTable columns={orderColumns} data={filteredByStatus} />
          ) : (
            <div className="text-center py-10">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <Package className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {t("supplier.orders.noOrdersFound")}
              </h3>
              <p className="mt-1 text-gray-500">{t("supplier.orders.noOrdersFoundDesc")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex">
      <SupplierSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("supplier.orders.title")}</h1>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">{t("supplier.orders.all")}</TabsTrigger>
            <TabsTrigger value="pending">{t("supplier.orders.status.pending")}</TabsTrigger>
            <TabsTrigger value="processing">{t("supplier.orders.status.processing")}</TabsTrigger>
            <TabsTrigger value="shipped">{t("supplier.orders.status.shipped")}</TabsTrigger>
            <TabsTrigger value="delivered">{t("supplier.orders.status.delivered")}</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{tabContent("all")}</TabsContent>
          <TabsContent value="pending">{tabContent("pending")}</TabsContent>
          <TabsContent value="processing">{tabContent("processing")}</TabsContent>
          <TabsContent value="shipped">{tabContent("shipped")}</TabsContent>
          <TabsContent value="delivered">{tabContent("delivered")}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}