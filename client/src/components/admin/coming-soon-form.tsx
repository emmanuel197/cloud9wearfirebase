import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/image-upload";
import ColorPicker from "./color-picker";

const comingSoonFormSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.number().min(1, { message: "Price must be at least 1" }),
  category: z.string().min(1, { message: "Category is required" }),
  supplierId: z.number().min(1, { message: "Supplier is required" }),
  discount: z.number().min(0).max(100).default(0),
  availableSizes: z.array(z.string()).min(1, { message: "At least one size is required" }),
  availableColors: z.array(z.string()).min(1, { message: "At least one color is required" }),
  imageUrls: z.array(z.string()).min(1, { message: "At least one image is required" }),
  releaseDate: z.date({ required_error: "Release date is required" }),
});

type ComingSoonFormValues = z.infer<typeof comingSoonFormSchema>;

interface ComingSoonFormProps {
  supplierId?: number;
  onSuccess?: () => void;
  product?: any; // Existing product data for editing
  isEditing?: boolean;
}

export default function ComingSoonForm({ 
  supplierId = 1, 
  onSuccess, 
  product, 
  isEditing = false 
}: ComingSoonFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls || []);
  const [sizes, setSizes] = useState<string[]>(product?.availableSizes || []);
  const [colors, setColors] = useState<string[]>(product?.availableColors || []);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const form = useForm<ComingSoonFormValues>({
    resolver: zodResolver(comingSoonFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "t-shirts",
      supplierId: product?.supplierId || supplierId,
      discount: product?.discount || 0,
      availableSizes: product?.availableSizes || [],
      availableColors: product?.availableColors || [],
      imageUrls: product?.imageUrls || [],
      releaseDate: product?.releaseDate ? new Date(product.releaseDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ComingSoonFormValues & { comingSoon: boolean; id?: number }) => {
      let response;
      if (isEditing && product?.id) {
        // Update existing product
        response = await apiRequest("PUT", `/api/products/coming-soon/${product.id}`, data);
      } else {
        // Create new product
        response = await apiRequest("POST", "/api/products/coming-soon", data);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Coming Soon product updated" : "Coming Soon product created",
        description: isEditing 
          ? "The product has been updated successfully" 
          : "The product has been added to the Coming Soon section",
      });
      
      if (!isEditing) {
        // Only reset form for new products
        form.reset();
        setImageUrls([]);
        setSizes([]);
        setColors([]);
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/coming-soon-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: isEditing ? "Error updating product" : "Error creating product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageAdded = (imageUrl: string) => {
    setImageUrls((prev) => [...prev, imageUrl]);
    form.setValue("imageUrls", [...imageUrls, imageUrl]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    form.setValue("imageUrls", updatedImages);
  };

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      const updatedSizes = [...sizes, newSize];
      setSizes(updatedSizes);
      form.setValue("availableSizes", updatedSizes);
      setNewSize("");
    }
  };

  const handleRemoveSize = (size: string) => {
    const updatedSizes = sizes.filter((s) => s !== size);
    setSizes(updatedSizes);
    form.setValue("availableSizes", updatedSizes);
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      const updatedColors = [...colors, newColor];
      setColors(updatedColors);
      form.setValue("availableColors", updatedColors);
      setNewColor("");
    }
  };

  const handleRemoveColor = (color: string) => {
    const updatedColors = colors.filter((c) => c !== color);
    setColors(updatedColors);
    form.setValue("availableColors", updatedColors);
  };

  const handleColorSelect = (colorName: string) => {
    setNewColor(colorName);
  };

  const onSubmit = (data: ComingSoonFormValues) => {
    // Add the coming soon flag to the data
    createMutation.mutate({
      ...data,
      comingSoon: true,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Limited Edition Collection 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Our upcoming exclusive limited edition design..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₵)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="49.99"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="t-shirts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Release Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FormLabel>Product Images</FormLabel>
            <span className="text-xs text-gray-500">
              {imageUrls.length} / 5 images
            </span>
          </div>
          
          <Tabs defaultValue="url">
            <TabsList className="mb-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-2">
              <ImageUpload
                onImageAdded={handleImageAdded}
                translations={{
                  imageUrl: "Image URL",
                  uploadImage: "Upload Image",
                  addImage: "Add Image",
                  orEnterUrl: "or enter URL",
                  selectImage: "Select Image",
                  urlTab: "URL",
                  uploadTab: "Upload",
                  uploading: "Uploading...",
                }}
              />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-5 gap-2 mt-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="h-20 w-full object-cover rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          {form.formState.errors.imageUrls && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.imageUrls.message}
            </p>
          )}
        </div>

        {/* Available Sizes */}
        <div className="space-y-2">
          <FormLabel>Available Sizes</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add size (e.g., S, M, L, XL)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
            />
            <Button type="button" onClick={handleAddSize}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {size}
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {form.formState.errors.availableSizes && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.availableSizes.message}
            </p>
          )}
        </div>

        {/* Available Colors */}
        <div className="space-y-2">
          <FormLabel>Available Colors</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add color (e.g., Black, White, Red)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="flex-1"
            />
            <ColorPicker onColorSelect={handleColorSelect} currentColor={newColor} buttonText="Pick" />
            <Button type="button" onClick={handleAddColor}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => (
              <Badge
                key={color}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: color }}
                ></span>
                {color}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {form.formState.errors.availableColors && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.availableColors.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending 
            ? (isEditing ? "Updating..." : "Creating...") 
            : (isEditing ? "Update Coming Soon Product" : "Create Coming Soon Product")
          }
        </Button>
      </form>
    </Form>
  );
}