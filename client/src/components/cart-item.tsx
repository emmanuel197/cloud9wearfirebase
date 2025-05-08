import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import PriceDisplay from "@/components/price-display";
import { getColorHex } from "@/lib/colorUtils";
import { normalizeImageUrl } from "@/lib/imageUtils";

interface CartItemProps {
  item: {
    productId: number;
    quantity: number;
    size: string;
    color: string;
    product: any;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();
  
  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) return;
    
    updateQuantity(item.productId, item.size, item.color, newQuantity);
  };
  
  const handleRemove = () => {
    removeFromCart(item.productId, item.size, item.color);
  };
  
  return (
    <div className="flex py-6 px-4">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.product.imageUrls[0]}
          alt={item.product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name}</h3>
            {item.product.discount ? (
              <div className="flex flex-col items-end">
                <PriceDisplay 
                  amount={item.product.price * (1 - Math.round(item.product.discount) / 100) * item.quantity} 
                />
                <PriceDisplay 
                  amount={item.product.price * item.quantity} 
                  className="text-sm line-through text-gray-400" 
                />
              </div>
            ) : (
              <PriceDisplay amount={item.product.price * item.quantity} />
            )}
          </div>
          <div className="mt-1 text-sm text-gray-700 flex items-center">
            <span 
              className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-200" 
              style={{ backgroundColor: getColorHex(item.color) }}
            />
            {item.color}
          </div>
          <p className="mt-1 text-sm text-gray-700">
            {t("cart.size")}: {item.size}
          </p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="mx-1 w-6 text-center font-medium">
              {item.quantity}
            </span>
            
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex">
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t("cart.remove")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
