import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product, insertProductSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Eye, 
  Loader2, 
  AlertTriangle,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Extended schema for the form
const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrls: z.string().array().min(1, "At least one image URL is required"),
  availableSizes: z.string().array().min(1, "At least one size must be selected"),
  availableColors: z.string().array().min(1, "At least one color must be selected"),
  supplierId: z.coerce.number().int().positive("Supplier ID is required"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AdminProducts() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch products
  const { data: products, isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["/api/products", categoryFilter],
    queryFn: () => {
      const url = new URL("/api/products", window.location.origin);
      if (categoryFilter && categoryFilter !== "all") {
        url.searchParams.append("category", categoryFilter);
      }
      return fetch(url.toString()).then(res => res.json());
    }
  });

  // Form for adding/editing products
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount: 0,
      category: "",
      imageUrls: [],
      availableSizes: [],
      availableColors: [],
      supplierId: user?.id || 0,
      stock: 0,
      isActive: true,
    },
  });

  // Reset form when editProduct changes
  useEffect(() => {
    if (editProduct) {
      form.reset({
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        category: editProduct.category,
        imageUrls: editProduct.imageUrls,
        availableSizes: editProduct.availableSizes,
        availableColors: editProduct.availableColors,
        supplierId: editProduct.supplierId,
        stock: editProduct.stock,
        isActive: editProduct.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        discount: 0,
        category: "",
        imageUrls: [],
        availableSizes: [],
        availableColors: [],
        supplierId: user?.id || 0,
        stock: 0,
        isActive: true,
      });
    }
  }, [editProduct, form, user?.id]);

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest("POST", "/api/products", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t("admin.products.addSuccess"),
        description: t("admin.products.addSuccessDesc"),
      });
      form.reset();
      setIsAddDialogOpen(false);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: t("admin.products.addError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: ProductFormValues }) => {
      const res = await apiRequest("PUT", `/api/products/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t("admin.products.updateSuccess"),
        description: t("admin.products.updateSuccessDesc"),
      });
      setEditProduct(null);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: t("admin.products.updateError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t("admin.products.deleteSuccess"),
        description: t("admin.products.deleteSuccessDesc"),
      });
      setDeleteId(null);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: t("admin.products.deleteError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (editProduct) {
      updateProductMutation.mutate({ id: editProduct.id, data });
    } else {
      addProductMutation.mutate(data);
    }
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    const currentImages = form.getValues("imageUrls") || [];
    form.setValue("imageUrls", [...currentImages, imageUrl]);
    setImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("imageUrls") || [];
    form.setValue("imageUrls", currentImages.filter((_, i) => i !== index));
  };

  const handleAddSize = () => {
    if (!size.trim()) return;
    const currentSizes = form.getValues("availableSizes") || [];
    if (!currentSizes.includes(size)) {
      form.setValue("availableSizes", [...currentSizes, size]);
    }
    setSize("");
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    const currentSizes = form.getValues("availableSizes") || [];
    form.setValue("availableSizes", currentSizes.filter(s => s !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (!color.trim()) return;
    const currentColors = form.getValues("availableColors") || [];
    if (!currentColors.includes(color)) {
      form.setValue("availableColors", [...currentColors, color]);
    }
    setColor("");
  };

  const handleRemoveColor = (colorToRemove: string) => {
    const currentColors = form.getValues("availableColors") || [];
    form.setValue("availableColors", currentColors.filter(c => c !== colorToRemove));
  };

  // Product columns for data table
  const productColumns = [
    {
      accessorKey: "id",
      header: t("admin.products.table.id"),
    },
    {
      accessorKey: "name",
      header: t("admin.products.table.name"),
    },
    {
      accessorKey: "price",
      header: t("admin.products.table.price"),
      cell: ({ row }: any) => (
        <span className="font-medium">
          ${Number(row.getValue("price")).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: t("admin.products.table.category"),
    },
    {
      accessorKey: "stock",
      header: t("admin.products.table.stock"),
      cell: ({ row }: any) => {
        const stock = row.getValue("stock") as number;
        return (
          <span className={`font-medium ${stock < 10 ? "text-red-500" : ""}`}>
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: t("admin.products.table.status"),
      cell: ({ row }: any) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
            {isActive ? t("admin.products.active") : t("admin.products.inactive")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: t("admin.products.table.actions"),
      cell: ({ row }: any) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="sr-only">{t("admin.products.actions")}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("admin.products.actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setEditProduct(product)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t("admin.products.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setDeleteId(product.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("admin.products.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (!user || user.role !== "admin") {
    return null; // Protected by ProtectedRoute component
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("admin.products.title")}</h1>
          <div className="flex items-center space-x-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("admin.products.filterByCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.products.allCategories")}</SelectItem>
                <SelectItem value="t-shirts">T-Shirts</SelectItem>
                <SelectItem value="hoodies">Hoodies</SelectItem>
                <SelectItem value="pants">Pants</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => refetch()}>
              {t("admin.refresh")}
            </Button>

            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.products.add")}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.products.title")}</CardTitle>
            <CardDescription>{t("admin.products.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : products && products.length > 0 ? (
              <DataTable columns={productColumns} data={products} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">{t("admin.products.noProducts")}</h3>
                <p className="text-gray-500 mt-1">{t("admin.products.noProductsDesc")}</p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin.products.addFirst")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Product Dialog */}
        <Dialog open={isAddDialogOpen || editProduct !== null} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditProduct(null);
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editProduct ? t("admin.products.editProduct") : t("admin.products.addProduct")}
              </DialogTitle>
              <DialogDescription>
                {editProduct ? t("admin.products.editDescription") : t("admin.products.addDescription")}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.products.form.name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.products.form.price")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.products.form.category")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("admin.products.form.selectCategory")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="t-shirts">T-Shirts</SelectItem>
                            <SelectItem value="hoodies">Hoodies</SelectItem>
                            <SelectItem value="pants">Pants</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.products.form.stock")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.products.form.supplier")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{t("admin.products.form.active")}</FormLabel>
                          <FormDescription>
                            {t("admin.products.form.activeDescription")}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.products.form.description")}</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URLs */}
                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.products.form.images")}</FormLabel>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            placeholder={t("admin.products.form.imageUrl")}
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                          />
                          <Button type="button" onClick={handleAddImage}>
                            {t("admin.products.form.addImage")}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {field.value.map((url, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center overflow-hidden">
                                <img src={url} alt="" className="w-10 h-10 object-cover mr-2" />
                                <span className="truncate">{url}</span>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveImage(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Sizes */}
                <FormField
                  control={form.control}
                  name="availableSizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.products.form.sizes")}</FormLabel>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            placeholder={t("admin.products.form.sizePlaceholder")}
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                          />
                          <Button type="button" onClick={handleAddSize}>
                            {t("admin.products.form.addSize")}
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((size) => (
                            <div key={size} className="flex items-center p-2 bg-gray-100 rounded">
                              <span>{size}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveSize(size)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Colors */}
                <FormField
                  control={form.control}
                  name="availableColors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.products.form.colors")}</FormLabel>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            placeholder={t("admin.products.form.colorPlaceholder")}
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                          />
                          <Button type="button" onClick={handleAddColor}>
                            {t("admin.products.form.addColor")}
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((color) => (
                            <div key={color} className="flex items-center p-2 bg-gray-100 rounded">
                              <span>{color}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveColor(color)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={addProductMutation.isPending || updateProductMutation.isPending}
                  >
                    {(addProductMutation.isPending || updateProductMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("admin.products.saving")}
                      </>
                    ) : editProduct ? (
                      t("admin.products.updateButton")
                    ) : (
                      t("admin.products.saveButton")
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("admin.products.deleteConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("admin.products.deleteConfirmDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("admin.products.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (deleteId !== null) {
                    deleteProductMutation.mutate(deleteId);
                  }
                }}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t("admin.products.confirmDelete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}