import { useState } from "react";
import { getColorHex, isLightColor } from "@/lib/colorUtils";
import { Check } from "lucide-react";

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPalette({
  colors,
  selectedColor,
  onColorChange,
}: ColorPaletteProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {colors
        .filter((color) => color.trim() !== "")
        .map((color) => {
          const hex = getColorHex(color);
          const isLight = isLightColor(hex);
          const isSelected = color === selectedColor;
          const isHovered = color === hoveredColor;

          return (
            <div
              key={color}
              className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-full cursor-pointer
                border-2 transition-all
                ${isSelected ? "border-black scale-110" : "border-transparent hover:scale-105"}
                ${isHovered ? "ring-2 ring-black ring-opacity-20" : ""}
              `}
              style={{ backgroundColor: hex }}
              onClick={() => onColorChange(color)}
              onMouseEnter={() => setHoveredColor(color)}
              onMouseLeave={() => setHoveredColor(null)}
              title={color}
            >
              {isSelected && (
                <Check
                  className={`h-5 w-5 ${isLight ? "text-black" : "text-white"}`}
                />
              )}
            </div>
          );
        })}
    </div>
  );
}