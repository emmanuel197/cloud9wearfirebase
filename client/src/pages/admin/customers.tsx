import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Mail, Phone, Calendar } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminCustomers() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // Fetch customers
  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/admin/customers"],
    queryFn: () => {
      return fetch("/api/admin/customers").then(res => res.json());
    }
  });
  
  const handleViewCustomer = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const customerData = await response.json();
      setSelectedCustomer(customerData);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast({
        title: t("admin.customers.fetchError"),
        variant: "destructive",
      });
    }
  };
  
  // Customer columns for data table
  const customerColumns = [
    {
      accessorKey: "id",
      header: t("admin.customers.table.id"),
    },
    {
      accessorKey: "fullName",
      header: t("admin.customers.table.name"),
      cell: ({ row }: any) => {
        const customer = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(customer.fullName)}
              </AvatarFallback>
            </Avatar>
            <span>{customer.fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: t("admin.customers.table.email"),
    },
    {
      accessorKey: "createdAt",
      header: t("admin.customers.table.joined"),
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: t("admin.customers.table.actions"),
      cell: ({ row }: any) => {
        const customer = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Dialog open={customer.id === selectedCustomer?.id} onOpenChange={(open) => {
              if (!open) {
                setSelectedCustomer(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleViewCustomer(customer.id);
                  }}
                >
                  {t("admin.customers.view")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                {selectedCustomer ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>{t("admin.customers.customerDetails")}</DialogTitle>
                      <DialogDescription>
                        {t("admin.customers.memberSince", { 
                          date: new Date(selectedCustomer.createdAt).toLocaleDateString() 
                        })}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-col items-center mb-6">
                        <Avatar className="h-20 w-20 mb-3">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                            {getInitials(selectedCustomer.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedCustomer.fullName}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{selectedCustomer.username}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedCustomer.email}</span>
                        </div>
                        
                        {selectedCustomer.phone && (
                          <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{selectedCustomer.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Add more customer information here as needed */}
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
          <h1 className="text-3xl font-bold">{t("admin.customers.title")}</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.customers.title")}</CardTitle>
            <CardDescription>{t("admin.customers.description")}</CardDescription>
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
            ) : customers && customers.length > 0 ? (
              <DataTable columns={customerColumns} data={customers} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">{t("admin.customers.noCustomers")}</h3>
                <p className="text-gray-500 mt-1">{t("admin.customers.noCustomersDesc")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}