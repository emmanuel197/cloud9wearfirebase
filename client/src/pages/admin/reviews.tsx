import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Review, Product, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Loader2, 
  Star, 
  StarHalf, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  Mail, 
  User as UserIcon 
} from "lucide-react";

type SortField = 'date' | 'rating' | 'product' | 'customer';
type SortOrder = 'asc' | 'desc';

type ReviewWithDetails = Review & {
  product?: {
    id: number;
    name: string;
    imageUrl: string;
  };
  customer?: {
    id: number;
    fullName: string;
    email: string;
  };
};

export default function AdminReviews() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [, setLocation] = useLocation();
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch all reviews
  const { data: reviews, isLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/admin/reviews"],
  });

  // Fetch all products for reference
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch all customers for reference
  const { data: customers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/users?role=customer");
      return await res.json();
    }
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      await apiRequest("DELETE", `/api/admin/reviews/${reviewId}`);
    },
    onSuccess: () => {
      toast({
        title: t("admin.reviews.deleteSuccess"),
        description: t("admin.reviews.deleteSuccessDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setReviewToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: t("admin.reviews.deleteError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to display stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} fill="currentColor" className="text-yellow-500" size={16} />
        ))}
        {hasHalfStar && <StarHalf fill="currentColor" className="text-yellow-500" size={16} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300" size={16} />
        ))}
      </div>
    );
  };

  const getProductName = (productId: number) => {
    const product = products?.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };
  
  const getCustomerName = (customerId: number) => {
    const customer = customers?.find(c => c.id === customerId);
    return customer ? customer.fullName : `Customer #${customerId}`;
  };
  
  const getCustomerEmail = (customerId: number) => {
    const customer = customers?.find(c => c.id === customerId);
    return customer ? customer.email : '-';
  };
  
  // Sort and filter reviews
  const sortedAndFilteredReviews = useMemo(() => {
    // First filter by search term
    let result = reviews?.filter(review => {
      if (!searchTerm) return true;
      
      // Search by product ID, customer ID, content, product name, or customer name
      return (
        review.productId.toString().includes(searchTerm) ||
        review.customerId.toString().includes(searchTerm) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProductName(review.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCustomerName(review.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCustomerEmail(review.customerId).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    // Then sort by selected field
    if (result) {
      result = [...result].sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        
        switch (sortField) {
          case 'rating':
            return (a.rating - b.rating) * factor;
          case 'product':
            return getProductName(a.productId).localeCompare(getProductName(b.productId)) * factor;
          case 'customer':
            return getCustomerName(a.customerId).localeCompare(getCustomerName(b.customerId)) * factor;
          case 'date':
          default:
            // Handle potential null createdAt values
            if (!a.createdAt) return 1 * factor;
            if (!b.createdAt) return -1 * factor;
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * factor;
        }
      });
    }
    
    return result;
  }, [reviews, searchTerm, sortField, sortOrder, products, customers]);
  
  // Handle sort toggle
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle order if same field clicked
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default desc order
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleViewProduct = (productId: number) => {
    setLocation(`/products/${productId}`);
  };

  const handleDeleteReview = (review: Review) => {
    setReviewToDelete(review);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      deleteReviewMutation.mutate(reviewToDelete.id);
    }
  };

  if (!user || user.role !== "admin") {
    return null; // Protected by ProtectedRoute component
  }

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("admin.reviews.title")}</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("admin.reviews.allReviews")}</CardTitle>
            <CardDescription>{t("admin.reviews.description")}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder={t("admin.reviews.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{t("admin.reviews.sortBy")}</span>
                <Select
                  value={sortField}
                  onValueChange={(value) => setSortField(value as SortField)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("admin.reviews.sortField")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">{t("admin.reviews.date")}</SelectItem>
                    <SelectItem value="rating">{t("admin.reviews.rating")}</SelectItem>
                    <SelectItem value="product">{t("admin.reviews.product")}</SelectItem>
                    <SelectItem value="customer">{t("admin.reviews.customer")}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="gap-1"
                >
                  {sortOrder === 'asc' ? t("common.ascending") : t("common.descending")}
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedAndFilteredReviews?.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {searchTerm 
                  ? t("admin.reviews.noSearchResults") 
                  : t("admin.reviews.noReviews")
                }
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.reviews.id")}</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('rating')}
                          className="flex items-center gap-1 px-0 font-medium"
                        >
                          {t("admin.reviews.rating")}
                          {sortField === 'rating' && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('product')}
                          className="flex items-center gap-1 px-0 font-medium"
                        >
                          {t("admin.reviews.product")}
                          {sortField === 'product' && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('customer')}
                          className="flex items-center gap-1 px-0 font-medium"
                        >
                          {t("admin.reviews.customer")}
                          {sortField === 'customer' && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>{t("admin.reviews.comment")}</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('date')}
                          className="flex items-center gap-1 px-0 font-medium"
                        >
                          {t("admin.reviews.date")}
                          {sortField === 'date' && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>{t("admin.reviews.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredReviews?.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.id}</TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={getProductName(review.productId)}>
                            {getProductName(review.productId)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <UserIcon className="h-3 w-3 mr-1 text-gray-500" />
                              {getCustomerName(review.customerId)}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {getCustomerEmail(review.customerId)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={review.comment}>
                            {review.comment}
                          </div>
                        </TableCell>
                        <TableCell>
                          {review.createdAt 
                            ? new Date(review.createdAt).toLocaleDateString() 
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewProduct(review.productId)}
                              title={t("admin.reviews.viewProduct")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteReview(review)}
                              title={t("admin.reviews.deleteReview")}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.reviews.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.reviews.deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteReview}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteReviewMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}