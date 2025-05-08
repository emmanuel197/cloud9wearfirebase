import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Review, Product } from "@shared/schema";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Star, StarHalf, Trash2, Eye } from "lucide-react";

export default function AdminReviews() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [, navigate] = useNavigate();
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // Fetch all reviews
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
  });

  // Fetch all products for reference
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
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

  // Filter reviews based on search term
  const filteredReviews = reviews?.filter(review => {
    if (!searchTerm) return true;
    
    // Search by product ID, customer ID, or content
    return (
      review.productId.toString().includes(searchTerm) ||
      review.customerId.toString().includes(searchTerm) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductName(review.productId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`);
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
            <div className="mb-4">
              <Input
                placeholder={t("admin.reviews.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredReviews?.length === 0 ? (
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
                      <TableHead>{t("admin.reviews.rating")}</TableHead>
                      <TableHead>{t("admin.reviews.product")}</TableHead>
                      <TableHead>{t("admin.reviews.customer")}</TableHead>
                      <TableHead>{t("admin.reviews.comment")}</TableHead>
                      <TableHead>{t("admin.reviews.date")}</TableHead>
                      <TableHead>{t("admin.reviews.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews?.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.id}</TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={getProductName(review.productId)}>
                            {getProductName(review.productId)}
                          </div>
                        </TableCell>
                        <TableCell>{review.customerId}</TableCell>
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