import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getColorHex } from "@/lib/colorUtils";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STANDARD_COLORS = [
  // Whites and creams
  { name: "White", hex: "#FFFFFF" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Off-White", hex: "#FAF9F6" },
  
  // Blacks and grays
  { name: "Black", hex: "#000000" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Dark Gray", hex: "#A9A9A9" },
  { name: "Gray", hex: "#808080" },
  { name: "Light Gray", hex: "#D3D3D3" },
  
  // Reds
  { name: "Red", hex: "#FF0000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Maroon", hex: "#800000" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Scarlet", hex: "#FF2400" },
  
  // Blues
  { name: "Blue", hex: "#0000FF" },
  { name: "Navy", hex: "#000080" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Teal", hex: "#008080" },
  
  // Greens
  { name: "Green", hex: "#008000" },
  { name: "Olive", hex: "#808000" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Mint Green", hex: "#98FB98" },
  { name: "Lime Green", hex: "#32CD32" },
  
  // Yellows
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Mustard", hex: "#FFDB58" },
  { name: "Lemon", hex: "#FFF44F" },
  
  // Browns
  { name: "Brown", hex: "#A52A2A" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Beige", hex: "#F5F5DC" },
  
  // Purples and pinks
  { name: "Purple", hex: "#800080" },
  { name: "Violet", hex: "#EE82EE" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Magenta", hex: "#FF00FF" },
  
  // Oranges
  { name: "Orange", hex: "#FFA500" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Peach", hex: "#FFE5B4" },
];

interface ColorPickerProps {
  onColorSelect: (colorName: string) => void;
  currentColor?: string;
  buttonText?: string;
}

export default function ColorPicker({ 
  onColorSelect, 
  currentColor, 
  buttonText
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(currentColor || "");
  const { translations } = useLanguage();
  const adminTranslations = translations.admin || {};
  const productsTranslations = adminTranslations.products || {};
  const formTranslations = productsTranslations.form || {};
  
  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    onColorSelect(colorName);
    setOpen(false);
  };
  
  // Use the translated text or fallback to a default
  const chooseColorText = buttonText || formTranslations.chooseColor || "Choose Color";
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          type="button"
        >
          {currentColor && (
            <span 
              className="inline-block w-4 h-4 rounded-full border border-gray-300" 
              style={{ backgroundColor: getColorHex(currentColor) }}
            />
          )}
          {chooseColorText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{formTranslations.selectAColor || "Select a Color"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto p-2">
          {STANDARD_COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => handleColorSelect(color.name)}
              className={`
                p-2 rounded border flex flex-col items-center justify-center h-20
                transition-all hover:border-primary
                ${selectedColor === color.name ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200'}
              `}
            >
              <div 
                className="w-10 h-10 rounded-full border border-gray-200 mb-1 relative"
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor === color.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                  </div>
                )}
              </div>
              <span className="text-xs text-center">{color.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}