import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import ProductGrid from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Filter, ChevronDown } from "lucide-react";

export default function ProductsPage() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Fetch all products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", category],
    queryFn: () => {
      const url = new URL("/api/products", window.location.origin);
      if (category) {
        url.searchParams.append("category", category);
      }
      return fetch(url.toString()).then(res => res.json());
    }
  });
  
  // Filter products by search term
  const filteredProducts = products?.filter(product => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );
  });
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{t("products.title")}</h1>
      
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("products.searchPlaceholder")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("products.categoryFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("products.allCategories")}</SelectItem>
              <SelectItem value="t-shirts">T-Shirts</SelectItem>
              <SelectItem value="hoodies">Hoodies</SelectItem>
              <SelectItem value="pants">Pants</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select defaultValue="latest">
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("products.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">{t("products.sortOptions.latest")}</SelectItem>
              <SelectItem value="price_low">{t("products.sortOptions.priceLow")}</SelectItem>
              <SelectItem value="price_high">{t("products.sortOptions.priceHigh")}</SelectItem>
              <SelectItem value="popular">{t("products.sortOptions.popular")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-64 w-full rounded-t-lg" />
              <CardContent className="pt-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-5xl mb-4">😢</div>
          <h3 className="text-xl font-medium mb-2">{t("products.noResults.title")}</h3>
          <p className="text-gray-500">{t("products.noResults.message")}</p>
        </div>
      )}
    </div>
  );
}
