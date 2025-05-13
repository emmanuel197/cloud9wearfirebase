import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import SupplierLayout from "@/components/supplier/layout";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddProducts() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get all products (created by admin)
  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  
  // Get supplier's current inventory
  const { data: supplierInventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });
  
  // Mutation to add product to supplier inventory
  const addToInventoryMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", "/api/inventory", {
        productId,
        stock: 0 // Start with 0 stock, supplier can update later
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.supplier.inventory.productAdded,
        description: t.supplier.inventory.productAddedDesc,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
    onError: (error: any) => {
      toast({
        title: t.supplier.inventory.addError,
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Check if a product is already in supplier's inventory
  const isProductInInventory = (productId: number) => {
    if (!supplierInventory) return false;
    return supplierInventory.some((item: any) => item.productId === productId);
  };
  
  // Filter products based on search term
  const filteredProducts = allProducts?.filter((product: any) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SupplierLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">{t.supplier.inventory.addProducts}</h1>
        
        <div className="mb-6">
          <Input
            placeholder={t.supplier.inventory.searchProducts}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {productsLoading || inventoryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <Card key={index} className="h-[250px]">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredProducts?.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t.supplier.inventory.noProductsFound}</h3>
                <p className="text-muted-foreground mt-2">{t.supplier.inventory.tryDifferentSearch}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts?.map((product: any) => {
                  const alreadyAdded = isProductInInventory(product.id);
                  
                  return (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={product.imageUrls[0] || 'https://placehold.co/400x300?text=No+Image'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge>{product.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="font-medium mb-4">
                          {t.shop.currency} {product.price.toFixed(2)}
                        </p>
                        <Button 
                          onClick={() => addToInventoryMutation.mutate(product.id)}
                          disabled={alreadyAdded || addToInventoryMutation.isPending}
                          className="w-full"
                          variant={alreadyAdded ? "outline" : "default"}
                        >
                          {alreadyAdded ? (
                            <>
                              <Check className="mr-2 h-4 w-4" /> 
                              {t.supplier.inventory.alreadyAdded}
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" /> 
                              {t.supplier.inventory.addToInventory}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </SupplierLayout>
  );
}