import { useState } from "react";
import { Product, SupplierInventory } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUtils";

interface InventoryItemProps {
  product: Product;
  inventory: SupplierInventory;
  stockValue: number;
  onStockChange: (value: number) => void;
  onUpdate: () => void;
  isUpdating: boolean;
}

export default function InventoryItem({
  product,
  inventory,
  stockValue,
  onStockChange,
  onUpdate,
  isUpdating
}: InventoryItemProps) {
  const { t } = useLanguage();
  const [stockInputValue, setStockInputValue] = useState(stockValue.toString());

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setStockInputValue(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onStockChange(value);
    }
  };

  // Determine if stock is low (less than 10 items)
  const isLowStock = stockValue < 10;

  return (
    <div className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="h-16 w-16 overflow-hidden rounded-md border flex-shrink-0 mr-4">
          <img
            src={normalizeImageUrl(product.imageUrls[0])}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              console.error('Supplier inventory item image failed to load:', e.currentTarget.src);
              e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
            }}
          />
        </div>
        
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{product.name}</h3>
            <Badge 
              variant="outline" 
              className="ml-2"
            >
              {product.category}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {t("supplier.inventory.id")}: {product.id}
          </p>
          
          <div className="flex items-center mt-1">
            <p className="text-sm">
              {t("supplier.inventory.availableSizes")}: {product.availableSizes.join(", ")}
            </p>
            <span className="mx-2 text-gray-300">|</span>
            <p className="text-sm">
              {t("supplier.inventory.availableColors")}: {product.availableColors.join(", ")}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">
            {t("supplier.inventory.stock")}
          </label>
          <div className="flex items-center">
            <Input
              type="number"
              min="0"
              value={stockInputValue}
              onChange={handleStockChange}
              className="w-24"
            />
            
            {isLowStock && (
              <div className="ml-2 text-amber-500 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">
                  {t("supplier.inventory.lowStock")}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={onUpdate}
          disabled={
            isUpdating || 
            stockValue === inventory.availableStock || 
            isNaN(stockValue) || 
            stockValue < 0
          }
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {t("supplier.inventory.update")}
        </Button>
      </div>
    </div>
  );
}
