import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Product, Review } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/contexts/CartContext";
import ProductReview from "@/components/product-review";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  TruckIcon, 
  ShoppingCart, 
  ArrowLeftIcon,
  ChevronRight,
  HomeIcon,
  InfoIcon,
  ChevronLeft,
  RotateCw
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });
  
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("productDetail.notFound.title")}</h2>
        <p className="mb-8">{t("productDetail.notFound.message")}</p>
        <Link href="/products">
          <Button>{t("productDetail.notFound.backButton")}</Button>
        </Link>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: t("productDetail.validation.sizeRequired"),
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedColor) {
      toast({
        title: t("productDetail.validation.colorRequired"),
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor,
      product, // Pass the full product for display purposes
    });
    
    toast({
      title: t("productDetail.addedToCart"),
      description: `${product.name} - ${selectedSize}, ${selectedColor}`,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <HomeIcon className="h-4 w-4 mr-1" />
              {t("navigation.home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">{t("navigation.products")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div>
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={product.imageUrls[currentImageIndex]}
              alt={`${product.name} - ${currentImageIndex === 0 ? 'Front' : 'Back'} view`}
              className="w-full h-auto object-cover"
            />
            
            {product.imageUrls.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(prev => 
                      prev === 0 ? product.imageUrls.length - 1 : prev - 1
                    );
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(prev => 
                      prev === product.imageUrls.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {product.imageUrls.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <div className="flex gap-1 px-2 py-1 bg-black/40 rounded-full">
                  {product.imageUrls.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-2 w-2 rounded-full cursor-pointer ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.imageUrls.map((url, index) => (
                <div 
                  key={index}
                  className={`border rounded cursor-pointer overflow-hidden ${
                    index === currentImageIndex 
                      ? 'border-black' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                >
                  <img
                    src={url}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="mb-4">
            {product.discount ? (
              <>
                <p className="text-2xl font-semibold text-primary">
                  ₵{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  <span className="ml-2 text-lg line-through text-gray-400">
                    ₵{product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-green-600">
                    ({Math.round(product.discount)}% off)
                  </span>
                </p>
              </>
            ) : (
              <p className="text-2xl font-semibold text-primary">₵{product.price.toFixed(2)}</p>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Size Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("productDetail.size")}</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("productDetail.selectSize")} />
              </SelectTrigger>
              <SelectContent>
                {product.availableSizes
                  .filter(size => size.trim() !== '')
                  .map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Color Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("productDetail.color")}</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("productDetail.selectColor")} />
              </SelectTrigger>
              <SelectContent>
                {product.availableColors
                  .filter(color => color.trim() !== '')
                  .map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">{t("productDetail.quantity")}</label>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="mx-4 font-semibold w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
              <span className="ml-4 text-sm text-gray-500">
                {product.stock} {t("productDetail.inStock")}
              </span>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            className="w-full mb-4 py-6" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock === 0
              ? t("productDetail.outOfStock")
              : t("productDetail.addToCart")
            }
          </Button>
          
          {/* Shipping Info */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <TruckIcon className="h-4 w-4 mr-2" />
            <span>{t("productDetail.shipping")}</span>
          </div>
          
          {/* Category */}
          <div className="text-sm text-gray-500">
            <span className="font-semibold">{t("productDetail.category")}:</span> {product.category}
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mb-16">
        <TabsList className="w-full">
          <TabsTrigger value="details">{t("productDetail.tabs.details")}</TabsTrigger>
          <TabsTrigger value="sizing">{t("productDetail.tabs.sizing")}</TabsTrigger>
          <TabsTrigger value="shipping">{t("productDetail.tabs.shipping")}</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-4 border rounded-b-lg">
          <h3 className="text-lg font-semibold mb-2">{t("productDetail.tabs.detailsTitle")}</h3>
          <p className="mb-4">{product.description}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>100% Premium Cotton</li>
            <li>Machine washable</li>
            <li>Printed using eco-friendly inks</li>
            <li>Pre-shrunk fabric</li>
            <li>Designed and printed in-house</li>
          </ul>
        </TabsContent>
        <TabsContent value="sizing" className="p-4 border rounded-b-lg">
          <h3 className="text-lg font-semibold mb-4">{t("productDetail.tabs.sizingTitle")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Chest (inches)</th>
                  <th className="px-4 py-2 text-left">Length (inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">S</td>
                  <td className="px-4 py-2">36-38</td>
                  <td className="px-4 py-2">28</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">M</td>
                  <td className="px-4 py-2">39-41</td>
                  <td className="px-4 py-2">29</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">L</td>
                  <td className="px-4 py-2">42-44</td>
                  <td className="px-4 py-2">30</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">XL</td>
                  <td className="px-4 py-2">45-47</td>
                  <td className="px-4 py-2">31</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="p-4 border rounded-b-lg">
          <h3 className="text-lg font-semibold mb-2">{t("productDetail.tabs.shippingTitle")}</h3>
          <p className="mb-4">{t("productDetail.tabs.shippingInfo")}</p>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex">
            <InfoIcon className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-amber-800 text-sm">{t("productDetail.tabs.shippingNote")}</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Product Reviews Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("Reviews")}</h2>
        <ProductReview productId={product.id} showHeading={false} />
      </div>
      
      {/* Related Products Section - Can be implemented if needed */}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-6 w-64" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded" />
            ))}
          </div>
        </div>
        
        <div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-4" />
          
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-4" />
          
          <Skeleton className="h-10 w-full mb-6" />
          
          <Skeleton className="h-12 w-full mb-4" />
          
          <Skeleton className="h-4 w-full mb-6" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-60 w-full rounded-lg mb-16" />
      
      {/* Review section skeleton */}
      <Skeleton className="h-10 w-60 mb-6" />
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );
}
