import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Truck, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import PriceDisplay from "@/components/price-display";

export default function AdminOrders() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Fetch orders
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["/api/orders", statusFilter],
    queryFn: () => {
      const url = new URL("/api/orders", window.location.origin);
      if (statusFilter && statusFilter !== "all") {
        url.searchParams.append("status", statusFilter);
      }
      return fetch(url.toString()).then(res => res.json());
    }
  });
  
  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status, trackingCode }: { id: number, status: string, trackingCode?: string }) => {
      const updateData: any = { status };
      
      if (trackingCode) {
        updateData.deliveryTrackingCode = trackingCode;
      }
      
      if (status === "shipped") {
        // Set estimated delivery date to 7 days from now
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        updateData.estimatedDeliveryDate = deliveryDate.toISOString();
      }
      
      const res = await apiRequest("PUT", `/api/orders/${id}`, updateData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: t("admin.orders.updateSuccess"),
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: t("admin.orders.updateError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleUpdateStatus = (id: number, status: string) => {
    if (status === "shipped" && !trackingCode) {
      toast({
        title: t("admin.orders.trackingRequired"),
        variant: "destructive",
      });
      return;
    }
    
    updateOrderMutation.mutate({ 
      id, 
      status, 
      ...(trackingCode ? { trackingCode } : {})
    });
  };
  
  const handleViewOrder = async (id: number) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const orderData = await response.json();
      setSelectedOrder(orderData);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: t("admin.orders.fetchError"),
        variant: "destructive",
      });
    }
  };
  
  // Clear all orders mutation
  const clearOrdersMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/admin/orders");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: t("admin.orders.clearSuccess"),
        description: t("admin.orders.clearSuccessDescription"),
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: t("admin.orders.clearError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Order status colors
  const orderStatusColors: Record<string, string> = {
    "pending": "bg-amber-100 text-amber-800",
    "processing": "bg-blue-100 text-blue-800",
    "shipped": "bg-indigo-100 text-indigo-800",
    "delivered": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800"
  };
  
  // Order columns for data table
  const orderColumns = [
    {
      accessorKey: "id",
      header: t("admin.orders.table.id"),
    },
    {
      accessorKey: "customerId",
      header: t("admin.orders.table.customer"),
    },
    {
      accessorKey: "totalAmount",
      header: t("admin.orders.table.amount"),
      cell: ({ row }: any) => (
        <span className="font-medium">
          ${Number(row.getValue("totalAmount")).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("admin.orders.table.status"),
      cell: ({ row }: any) => {
        const status = row.getValue("status") as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderStatusColors[status] || "bg-gray-100"}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "orderDate",
      header: t("admin.orders.table.date"),
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("orderDate"));
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: t("admin.orders.table.actions"),
      cell: ({ row }: any) => {
        const order = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the dialog from opening immediately
                    handleViewOrder(order.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t("admin.orders.view")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl" onPointerDownOutside={(e) => e.preventDefault()}>
                {selectedOrder ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>{t("admin.orders.orderDetails", { id: selectedOrder.id })}</DialogTitle>
                      <DialogDescription>
                        {new Date(selectedOrder.orderDate).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-medium mb-1">{t("admin.orders.customerInfo")}</h3>
                        <p>ID: {selectedOrder.customerId}</p>
                        <p>{t("admin.orders.address")}: {selectedOrder.shippingAddress}</p>
                        <p>{t("admin.orders.phone")}: {selectedOrder.contactPhone}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{t("admin.orders.orderInfo")}</h3>
                        <p>
                          {t("admin.orders.status")}: 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${orderStatusColors[selectedOrder.status] || "bg-gray-100"}`}>
                            {selectedOrder.status}
                          </span>
                        </p>
                        <p>{t("admin.orders.payment")}: {selectedOrder.paymentMethod}</p>
                        <p>
                          {t("admin.orders.paymentStatus")}: 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedOrder.paymentStatus === "paid" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {selectedOrder.paymentStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">{t("admin.orders.items")}</h3>
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">Product ID: {item.productId}</p>
                            <p className="text-sm text-gray-500">
                              {item.size}, {item.color} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">${item.priceAtPurchase * item.quantity}</p>
                        </div>
                      ))}
                      
                      <div className="flex justify-between mt-4 font-semibold">
                        <span>{t("admin.orders.total")}</span>
                        <span>${selectedOrder.totalAmount}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">{t("admin.orders.updateStatus")}</h3>
                        <div className="flex space-x-2">
                          <Select 
                            defaultValue={selectedOrder.status}
                            onValueChange={(value) => {
                              updateOrderMutation.mutate({ 
                                id: selectedOrder.id, 
                                status: value,
                              });
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("admin.orders.selectStatus")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{t("admin.orders.statuses.pending")}</SelectItem>
                              <SelectItem value="processing">{t("admin.orders.statuses.processing")}</SelectItem>
                              <SelectItem value="shipped">{t("admin.orders.statuses.shipped")}</SelectItem>
                              <SelectItem value="delivered">{t("admin.orders.statuses.delivered")}</SelectItem>
                              <SelectItem value="cancelled">{t("admin.orders.statuses.cancelled")}</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            disabled={updateOrderMutation.isPending}
                            onClick={() => {
                              updateOrderMutation.mutate({ 
                                id: selectedOrder.id, 
                                status: selectedOrder.status,
                              });
                            }}
                          >
                            {updateOrderMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : t("admin.orders.update")}
                          </Button>
                        </div>
                      </div>
                      
                      {selectedOrder.status === "processing" && (
                        <div>
                          <h3 className="font-medium mb-2">{t("admin.orders.addTracking")}</h3>
                          <div className="flex space-x-2">
                            <Input 
                              placeholder={t("admin.orders.trackingPlaceholder")} 
                              value={trackingCode}
                              onChange={(e) => setTrackingCode(e.target.value)}
                            />
                            <Button 
                              variant="secondary"
                              disabled={updateOrderMutation.isPending || !trackingCode}
                              onClick={() => {
                                handleUpdateStatus(selectedOrder.id, "shipped");
                              }}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              {t("admin.orders.markShipped")}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedOrder.deliveryTrackingCode && (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <h3 className="font-medium mb-1 text-blue-800">{t("admin.orders.trackingInfo")}</h3>
                          <p className="text-blue-700">
                            {t("admin.orders.trackingCode")}: <span className="font-medium">{selectedOrder.deliveryTrackingCode}</span>
                          </p>
                          {selectedOrder.estimatedDeliveryDate && (
                            <p className="text-blue-700">
                              {t("admin.orders.estimatedDelivery")}: {new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];
  
  if (!user || user.role !== "admin") {
    return null; // Protected by ProtectedRoute component
  }
  
  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("admin.orders.title")}</h1>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("admin.orders.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.orders.allOrders")}</SelectItem>
                <SelectItem value="pending">{t("admin.orders.statuses.pending")}</SelectItem>
                <SelectItem value="processing">{t("admin.orders.statuses.processing")}</SelectItem>
                <SelectItem value="shipped">{t("admin.orders.statuses.shipped")}</SelectItem>
                <SelectItem value="delivered">{t("admin.orders.statuses.delivered")}</SelectItem>
                <SelectItem value="cancelled">{t("admin.orders.statuses.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => refetch()}>
              {t("admin.refresh")}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{t("admin.orders.title")}</CardTitle>
              <CardDescription>{t("admin.orders.description")}</CardDescription>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={!orders || orders.length === 0 || clearOrdersMutation.isPending}
                  >
                    {clearOrdersMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 mr-2" />
                    )}
                    {t("admin.orders.clearOrders")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("admin.orders.clearOrdersConfirmTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("admin.orders.clearOrdersConfirmDesc")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">{t("admin.orders.cancel")}</Button>
                    </DialogClose>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        clearOrdersMutation.mutate();
                      }}
                      disabled={clearOrdersMutation.isPending}
                    >
                      {clearOrdersMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-2" />
                      )}
                      {t("admin.orders.confirmClear")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : orders && orders.length > 0 ? (
              <DataTable columns={orderColumns} data={orders} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">{t("admin.orders.noOrders")}</h3>
                <p className="text-gray-500 mt-1">{t("admin.orders.noOrdersDesc")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
