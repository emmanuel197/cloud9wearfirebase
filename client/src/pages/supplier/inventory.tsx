import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SupplierSidebar from "@/components/supplier/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product, SupplierInventory } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Save, AlertTriangle, Search } from "lucide-react";
import InventoryItem from "@/components/supplier/inventory-item";

export default function SupplierInventoryPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStock, setUpdatingStock] = useState<{[key: number]: number}>({});
  
  // Fetch products and inventory
  const { data: inventory, isLoading: isLoadingInventory, refetch: refetchInventory } = useQuery<SupplierInventory[]>({
    queryKey: ["/api/inventory"],
  });
  
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => {
      const url = new URL("/api/products", window.location.origin);
      url.searchParams.append("supplierId", user?.id.toString() || "0");
      return fetch(url.toString()).then(res => res.json());
    }
  });
  
  // Create inventory items for any products that don't have them
  const updateInventoryMissingItems = useMutation({
    mutationFn: async (productId: number) => {
      // Add product to inventory with default stock of 0
      const res = await apiRequest("PUT", `/api/inventory/${productId}`, { stock: 0 });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      refetchInventory();
    }
  });
  
  // Update inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: async ({ productId, stock }: { productId: number, stock: number }) => {
      const res = await apiRequest("PUT", `/api/inventory/${productId}`, { stock });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t("supplier.inventory.updateSuccess"),
      });
      setUpdatingStock({});
      refetchInventory();
    },
    onError: (error: Error) => {
      toast({
        title: t("supplier.inventory.updateError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Helper function to find product details by ID
  const getProductDetails = (productId: number) => {
    return products?.find(product => product.id === productId);
  };
  
  // Handle stock update
  const handleStockChange = (productId: number, value: number) => {
    setUpdatingStock(prev => ({
      ...prev,
      [productId]: value,
    }));
  };
  
  const handleUpdateStock = (productId: number) => {
    const newStock = updatingStock[productId];
    if (newStock !== undefined) {
      updateInventoryMutation.mutate({ productId, stock: newStock });
    }
  };
  
  // Check if there are products without inventory entries and add them
  useEffect(() => {
    if (products && inventory && user?.id) {
      // Get all product IDs
      const productIds = products.map(product => product.id);
      // Get all inventory item product IDs
      const inventoryProductIds = inventory.map(item => item.productId);
      
      // Find products that don't have an inventory entry
      const missingProducts = productIds.filter(id => !inventoryProductIds.includes(id));
      
      // Add these products to inventory
      missingProducts.forEach(productId => {
        updateInventoryMissingItems.mutate(productId);
      });
    }
  }, [products, inventory, user?.id]);
  
  // Filter inventory based on search term
  const filteredInventory = inventory?.filter(item => {
    if (!searchTerm) return true;
    
    const product = getProductDetails(item.productId);
    if (!product) return false;
    
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.id.toString().includes(search)
    );
  });
  
  if (!user || user.role !== "supplier") {
    return null; // Protected by ProtectedRoute component
  }
  
  const isLoading = isLoadingInventory || isLoadingProducts;
  
  return (
    <div className="flex">
      <SupplierSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("supplier.inventory.title")}</h1>
          <Button variant="outline" onClick={() => refetchInventory()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("supplier.inventory.refresh")}
          </Button>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t("supplier.inventory.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("supplier.inventory.title")}</CardTitle>
            <CardDescription>{t("supplier.inventory.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-60" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredInventory && filteredInventory.length > 0 ? (
              <div className="space-y-4">
                {filteredInventory.map((item) => {
                  const product = getProductDetails(item.productId);
                  if (!product) return null;
                  
                  return (
                    <InventoryItem
                      key={item.productId}
                      product={product}
                      inventory={item}
                      stockValue={updatingStock[item.productId] !== undefined ? updatingStock[item.productId] : item.availableStock}
                      onStockChange={(value) => handleStockChange(item.productId, value)}
                      onUpdate={() => handleUpdateStock(item.productId)}
                      isUpdating={updateInventoryMutation.isPending}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">{t("supplier.inventory.noProducts")}</h3>
                <p className="text-gray-500 mt-1">{t("supplier.inventory.noProductsDesc")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
