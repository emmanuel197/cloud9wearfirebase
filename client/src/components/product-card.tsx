import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import PriceDisplay from "@/components/price-display";
import { normalizeImageUrl } from "@/lib/imageUtils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };
  
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: t("products.selectOptions"),
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      product,
    });
    
    toast({
      title: t("products.addedToCart"),
      description: `${product.name} - ${selectedSize}, ${selectedColor}`,
    });
    
    setIsDialogOpen(false);
  };
  
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative">
          <img 
            src={normalizeImageUrl(product.imageUrls[0])} 
            alt={product.name} 
            className="w-full h-64 object-cover"
            onError={(e) => {
              console.error('Product card image failed to load:', e.currentTarget.src);
              e.currentTarget.src = 'https://via.placeholder.com/300';
            }}
          />
          {product.imageUrls.length > 1 && (
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {product.imageUrls.length} views
            </div>
          )}
          <Button 
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            size="sm"
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {t("products.quickAdd")}
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="flex space-x-1">
              {product.availableColors.slice(0, 3).map((color, index) => (
                <span 
                  key={index} 
                  className="w-4 h-4 rounded-full border border-gray-300" 
                  style={{ 
                    backgroundColor: color.toLowerCase(), 
                    border: color.toLowerCase() === 'white' ? '1px solid #e5e7eb' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-500 mb-4 text-sm line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <div>
              {product.discount ? (
                <>
                  <PriceDisplay 
                    amount={product.price * (1 - product.discount / 100)} 
                    className="text-lg font-bold" 
                  />
                  <PriceDisplay amount={product.price} className="text-sm line-through text-gray-400 ml-2" />
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {Math.round(product.discount)}% off
                  </span>
                </>
              ) : (
                <PriceDisplay amount={product.price} className="text-lg font-bold" />
              )}
            </div>
            {product.stock <= 0 && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                {t("products.outOfStock")}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("products.quickAddTitle")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={normalizeImageUrl(product.imageUrls[0])} 
                  alt={product.name} 
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  {product.discount ? (
                    <div className="flex items-center">
                      <PriceDisplay 
                        amount={product.price * (1 - product.discount / 100)} 
                        className="font-medium" 
                      />
                      <PriceDisplay 
                        amount={product.price} 
                        className="text-sm line-through text-gray-400 ml-2" 
                      />
                    </div>
                  ) : (
                    <PriceDisplay amount={product.price} />
                  )}
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("products.selectSize")}</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("products.size")} />
                    </SelectTrigger>
                    <SelectContent>
                      {product.availableSizes.map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("products.selectColor")}</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("products.color")} />
                    </SelectTrigger>
                    <SelectContent>
                      {product.availableColors.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              {t("products.cancel")}
            </Button>
            <Button onClick={handleAddToCart} disabled={product.stock <= 0}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock <= 0 ? t("products.outOfStock") : t("products.addToCart")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Link>
  );
}
