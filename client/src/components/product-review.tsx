import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Star, StarHalf, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Review } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductReviewProps {
  productId: number;
  showHeading?: boolean;
}

export default function ProductReview({ productId, showHeading = false }: ProductReviewProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  
  // Fetch reviews for this product
  const { data, isLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
  });
  
  const reviews = data || [];
  
  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  // Post review mutation
  const postReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      const res = await apiRequest(
        "POST", 
        `/api/products/${productId}/reviews`, 
        reviewData
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      setRating(5);
      setComment("");
      toast({
        title: t("products.reviewSubmitSuccess"),
        description: t("products.reviewSubmitSuccessDesc"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("products.reviewSubmitError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: t("products.loginRequired"),
        description: t("products.loginRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 3) {
      toast({
        title: t("products.reviewMinLength"),
        variant: "destructive",
      });
      return;
    }

    postReviewMutation.mutate({ rating, comment });
  };

  // Function to display stars
  const renderStars = (rating: number, size: number = 20) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} fill="currentColor" className="text-yellow-500" size={size} />
        ))}
        {hasHalfStar && <StarHalf fill="currentColor" className="text-yellow-500" size={size} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300" size={size} />
        ))}
      </div>
    );
  };

  // Interactive rating selector
  const renderRatingSelector = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`${
                (hoveredRating ? hoveredRating >= value : rating >= value)
                  ? "text-yellow-500 fill-yellow-500" 
                  : "text-gray-300"
              } w-6 h-6 cursor-pointer transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        {showHeading && <h2 className="text-2xl font-bold mb-4">{t("products.reviews")}</h2>}
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {showHeading && <h2 className="text-2xl font-bold mb-4">{t("products.reviews")}</h2>}
      
      {reviews.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/3 bg-slate-50 p-6 rounded-lg">
            <div className="text-center">
              <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
              <div className="flex justify-center my-2">
                {renderStars(averageRating)}
              </div>
              <p className="text-sm text-gray-500">
                {t("Based On", { count: reviews.length.toString() })}
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            {user && user.role === "customer" && (
              <>
                <div className="mb-6 bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t("Write Review")}</h3>
                  <div className="mb-2">{renderRatingSelector()}</div>
                  <Textarea
                    placeholder={t("Review Placeholder")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={postReviewMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {postReviewMutation.isPending ? t("common.submitting") : t("Submit Review")}
                  </Button>
                </div>
                <Separator className="my-4" />
              </>
            )}
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{review.customerId}</p>
                        <p className="text-xs text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                      {renderStars(review.rating, 16)}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <p className="text-lg mb-4">{t("No Reviews")}</p>
          
          {user && user.role === "customer" && (
            <>
              <p className="mb-4">{t("Be First To Review")}</p>
              <div className="inline-block text-left">
                <div className="mb-2">{renderRatingSelector()}</div>
                <Textarea
                  placeholder={t("products.reviewPlaceholder")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  onClick={handleSubmitReview}
                  disabled={postReviewMutation.isPending}
                  className="w-full"
                >
                  {postReviewMutation.isPending ? t("common.submitting") : t("products.submitReview")}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}