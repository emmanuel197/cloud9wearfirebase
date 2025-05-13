import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Plus, Check } from "lucide-react";
import SupplierLayout from "@/components/supplier/layout";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  availableSizes: string[];
  availableColors: string[];
  stock: number;
  isActive: boolean;
}

interface InventoryItem {
  id: number;
  supplierId: number;
  productId: number;
  product: Product;
  stock: number;
  availableSizes: string[];
  availableColors: string[];
}

export default function SupplierAddProducts() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch supplier's current inventory to know which products they already have
  const { data: inventoryData, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/inventory");
      return await res.json();
    },
  });

  // Fetch available products that supplier can add to inventory
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/available-products"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/available-products");
      return await res.json();
    },
  });

  // Mutation to add product to supplier inventory
  const addToInventoryMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/inventory", { productId, stock: 0 });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t("supplier.inventory.productAdded"),
        description: t("supplier.inventory.productAddedDesc"),
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
    onError: (error: Error) => {
      toast({
        title: t("supplier.inventory.addError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler for adding a product to inventory
  const handleAddToInventory = (productId: number) => {
    addToInventoryMutation.mutate(productId);
  };

  // Filter and paginate products based on search query
  const filteredProducts = productsData
    ? productsData.filter((product: Product) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      })
    : [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Products returned from our API are guaranteed not to be in inventory already
  // This is just a safety check in case the UI gets out of sync
  const isProductInInventory = (productId: number) => {
    return inventoryData?.some((item: InventoryItem) => item.productId === productId) || false;
  };

  // Pagination navigation
  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <SupplierLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("supplier.inventory.addProducts")}</h1>
            <p className="text-gray-500">
              {t("supplier.inventory.description")}
            </p>
          </div>
          <div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {productsData?.length || 0} {t("supplier.inventory.availableToAdd")}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("supplier.inventory.searchProducts")}</CardTitle>
            <CardDescription>
              Browse and add products from our catalog to your inventory
            </CardDescription>
            <div className="flex items-center mt-2">
              <Search className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                placeholder={t("supplier.inventory.searchProducts")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                className="flex-1"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProducts || isLoadingInventory ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : paginatedProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sizes</TableHead>
                    <TableHead>Colors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product: Product) => {
                    const alreadyInInventory = isProductInInventory(product.id);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="h-16 w-16 relative overflow-hidden rounded-md">
                            {product.imageUrls && product.imageUrls.length > 0 ? (
                              <img
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                No image
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>₵{product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.availableSizes.map((size, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.availableColors.map((color, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {alreadyInInventory ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              {t("supplier.inventory.alreadyAdded")}
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleAddToInventory(product.id)}
                              disabled={addToInventoryMutation.isPending}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              {t("supplier.inventory.addToInventory")}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-lg font-medium mb-2">
                  {t("supplier.inventory.noProductsFound")}
                </p>
                <p className="text-gray-500">
                  {t("supplier.inventory.tryDifferentSearch")}
                </p>
              </div>
            )}
          </CardContent>
          {filteredProducts.length > itemsPerPage && (
            <CardFooter className="flex justify-center py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => navigateToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => navigateToPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => navigateToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          )}
        </Card>
      </div>
    </SupplierLayout>
  );
}