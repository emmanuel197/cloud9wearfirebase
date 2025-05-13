import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Mail, Phone, Calendar, Package } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminSuppliers() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Fetch suppliers
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["/api/admin/suppliers"],
    queryFn: () => {
      return fetch("/api/admin/suppliers").then(res => res.json());
    }
  });

  // Fetch supplier inventory when a supplier is selected
  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["/api/supplier/inventory", selectedSupplier?.id],
    queryFn: () => {
      if (!selectedSupplier) return null;
      return fetch(`/api/supplier/inventory/${selectedSupplier.id}`)
        .then(res => res.json())
        .then(data => {
          console.log("Supplier inventory data:", data);
          return data;
        });
    },
    enabled: !!selectedSupplier
  });

  const handleViewSupplier = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const supplierData = await response.json();
      setSelectedSupplier(supplierData);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      toast({
        title: t("admin.suppliers.fetchError"),
        variant: "destructive",
      });
    }
  };

  // Supplier columns for data table
  const supplierColumns = [
    {
      accessorKey: "id",
      header: t("admin.suppliers.table.id"),
    },
    {
      accessorKey: "fullName",
      header: t("admin.suppliers.table.name"),
      cell: ({ row }: any) => {
        const supplier = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(supplier.fullName)}
              </AvatarFallback>
            </Avatar>
            <span>{supplier.fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: t("admin.suppliers.table.email"),
    },
    {
      accessorKey: "productCount", 
      header: t("admin.suppliers.table.products"),
      cell: ({ row }: any) => {
        const count = row.getValue("productCount") || 0;
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            {count} {count === 1 ? t("admin.suppliers.product") : t("admin.suppliers.products")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalInventoryStock", 
      header: t("admin.suppliers.table.totalStock"),
      cell: ({ row }: any) => {
        const totalStock = row.getValue("totalInventoryStock") || 0;
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            {totalStock} {t("admin.suppliers.itemsInStock")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("admin.suppliers.table.joined"),
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: t("admin.suppliers.table.actions"),
      cell: ({ row }: any) => {
        const supplier = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Dialog open={supplier.id === selectedSupplier?.id} onOpenChange={(open) => {
              if (!open) {
                setSelectedSupplier(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleViewSupplier(supplier.id);
                  }}
                >
                  {t("admin.suppliers.view")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl" onOpenAutoFocus={(e) => e.preventDefault()}>
                {selectedSupplier ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-gray-100">{t("admin.suppliers.supplierDetails")}</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        {t("admin.suppliers.memberSince", { 
                          date: new Date(selectedSupplier.createdAt).toLocaleDateString() 
                        })}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div className="md:col-span-1">
                        <div className="flex flex-col items-center p-4 border rounded-lg dark:border-gray-700">
                          <Avatar className="h-20 w-20 mb-3">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                              {getInitials(selectedSupplier.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedSupplier.fullName}</h3>
                          <p className="text-gray-500 dark:text-gray-400">{selectedSupplier.username}</p>

                          <div className="w-full mt-4 space-y-2">
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                              <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{selectedSupplier.email}</span>
                            </div>

                            {selectedSupplier.phone && (
                              <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{selectedSupplier.phone}</span>
                              </div>
                            )}

                            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{new Date(selectedSupplier.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <Card className="dark:border-gray-700">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{t("admin.suppliers.inventory")}</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">{t("admin.suppliers.inventoryDescription")}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {isLoadingInventory ? (
                              <div className="space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                              </div>
                            ) : inventory && inventory.length > 0 ? (
                              <div className="space-y-3">
                                {inventory.map((item: any) => (
                                  <div key={item.productId} className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-primary/10 rounded-md dark:bg-primary/20">
                                        <Package className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                          {item.product ? item.product.name : `Product #${item.productId}`}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {item.product ? item.product.category : t("admin.suppliers.unknownCategory")}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge className={item.availableStock > 10 ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900" : "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-900"}>
                                          {t("admin.suppliers.stock")}: {item.availableStock}
                                        </Badge>
                                      </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-6 text-center">
                                <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                                <h3 className="font-medium">{t("admin.suppliers.noInventory")}</h3>
                                <p className="text-gray-500 text-sm mt-1">{t("admin.suppliers.noInventoryDesc")}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
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

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user || user.role !== "admin") {
    return null; // Protected by ProtectedRoute component
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("admin.suppliers.title")}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.suppliers.title")}</CardTitle>
            <CardDescription>{t("admin.suppliers.description")}</CardDescription>
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
            ) : suppliers && suppliers.length > 0 ? (
              <DataTable columns={supplierColumns} data={suppliers} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">{t("admin.suppliers.noSuppliers")}</h3>
                <p className="text-gray-500 mt-1">{t("admin.suppliers.noSuppliersDesc")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}