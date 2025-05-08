// Color mapping utility for product colors
interface ColorMap {
  [key: string]: string;
}

// Map common color names to hex values
export const colorMap: ColorMap = {
  // Basic colors
  "red": "#ff0000",
  "green": "#008000",
  "blue": "#0000ff",
  "yellow": "#ffff00",
  "orange": "#ffa500",
  "purple": "#800080",
  "pink": "#ffc0cb",
  "brown": "#a52a2a",
  "black": "#000000",
  "white": "#ffffff",
  "gray": "#808080",
  "grey": "#808080",
  
  // Common clothing color names
  "navy": "#000080",
  "navy blue": "#000080",
  "royal blue": "#4169e1",
  "sky blue": "#87ceeb",
  "teal": "#008080",
  "turquoise": "#40e0d0",
  "mint": "#98fb98",
  "olive": "#808000",
  "forest green": "#228b22",
  "lime green": "#32cd32",
  "maroon": "#800000",
  "burgundy": "#800020",
  "wine": "#722f37",
  "coral": "#ff7f50",
  "salmon": "#fa8072",
  "peach": "#ffe5b4",
  "khaki": "#f0e68c",
  "tan": "#d2b48c",
  "beige": "#f5f5dc",
  "cream": "#fffdd0",
  "off white": "#f8f8ff",
  "charcoal": "#36454f",
  "silver": "#c0c0c0",
  "gold": "#ffd700",
  "ivory": "#fffff0",
  "lavender": "#e6e6fa",
  "lilac": "#c8a2c8",
  "indigo": "#4b0082",
  "magenta": "#ff00ff",
  "violet": "#ee82ee",
  "plum": "#dda0dd",
};

// Function to get color hex value from color name
export const getColorHex = (colorName: string): string => {
  const lowerColorName = colorName.toLowerCase().trim();
  return colorMap[lowerColorName] || "#cccccc"; // Return a default color if not found
};

// Function to determine if a color is light or dark
export const isLightColor = (hexColor: string): boolean => {
  // Remove the hash if it exists
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness using the formula (0.299*R + 0.587*G + 0.114*B)
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
  
  // Return true if color is light (brightness > 150)
  return brightness > 150;
};