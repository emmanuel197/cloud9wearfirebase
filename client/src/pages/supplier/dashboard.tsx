import { useQuery } from "@tanstack/react-query";
import SupplierSidebar from "@/components/supplier/sidebar";
import StatCard from "@/components/admin/stat-card";
import SalesChart from "@/components/admin/sales-chart";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { PackageIcon, BoxIcon, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SupplierDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Fetch supplier inventory with proper TypeScript typing
  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });
  
  // Get low stock items - safely handle potentially undefined items
  const lowStockItems = inventory.filter(item => item && item.availableStock < 10);
  
  if (!user || user.role !== "supplier") {
    return null; // Protected by ProtectedRoute component
  }
  
  // Columns for low stock table
  const lowStockColumns = [
    {
      accessorKey: "productId",
      header: t("supplier.dashboard.products.id"),
    },
    {
      accessorKey: "availableStock",
      header: t("supplier.dashboard.products.stock"),
      cell: ({ row }: any) => (
        <span className={`font-medium ${row.getValue("availableStock") < 5 ? "text-red-500" : "text-amber-500"}`}>
          {row.getValue("availableStock")}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: t("supplier.dashboard.products.lastUpdated"),
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("updatedAt"));
        return date.toLocaleDateString();
      },
    },
  ];
  
  return (
    <div className="flex">
      <SupplierSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("supplier.dashboard.title")}</h1>
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString()} | {user.fullName}
          </span>
        </div>
        
        {/* Welcome Card */}
        <Card className="mb-8 dark-mode-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <PackageIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-on-dark">{t("supplier.dashboard.welcome", { name: user.fullName })}</h2>
                <p className="text-subtle-on-dark">{t("supplier.dashboard.welcomeMessage")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {isLoadingInventory ? (
            <>
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </>
          ) : (
            <>
              <StatCard 
                title={t("supplier.dashboard.stats.totalProducts")}
                value={inventory.length.toString()}
                icon={<BoxIcon className="h-8 w-8 text-primary" />}
              />
              <StatCard 
                title={t("supplier.dashboard.stats.lowStock")}
                value={lowStockItems.length.toString()}
                description={lowStockItems.length > 0 ? t("supplier.dashboard.stats.needsAttention") : ""}
                icon={<AlertTriangle className="h-8 w-8 text-amber-500" />}
              />
              <StatCard 
                title={t("supplier.dashboard.stats.totalStock")}
                value={inventory.reduce((sum: number, item: any) => sum + (item?.availableStock || 0), 0).toString()}
                icon={<TrendingUp className="h-8 w-8 text-green-500" />}
              />
            </>
          )}
        </div>
        
        {/* Low Stock Alert */}
        <Card className="mb-8 dark-mode-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-on-dark">{t("supplier.dashboard.lowStockTitle")}</CardTitle>
            <CardDescription className="text-subtle-on-dark">{t("supplier.dashboard.lowStockDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingInventory ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : lowStockItems.length > 0 ? (
              <div className="text-on-dark">
                <DataTable columns={lowStockColumns} data={lowStockItems} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <PackageIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-on-dark">{t("supplier.dashboard.allStocked")}</h3>
                <p className="text-subtle-on-dark mt-1">{t("supplier.dashboard.allStockedDesc")}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Action Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="dark-mode-card">
            <CardHeader>
              <CardTitle className="text-on-dark">{t("supplier.dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/supplier/inventory">
                <Button className="w-full">
                  <BoxIcon className="mr-2 h-4 w-4" />
                  {t("supplier.dashboard.manageInventory")}
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="dark-mode-card">
            <CardHeader>
              <CardTitle className="text-on-dark">{t("supplier.dashboard.tips")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-on-dark">
                <li>{t("supplier.dashboard.tip1")}</li>
                <li>{t("supplier.dashboard.tip2")}</li>
                <li>{t("supplier.dashboard.tip3")}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
