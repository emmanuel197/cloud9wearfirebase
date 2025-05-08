
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
import { Review } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ProductReviewProps {
  productId: number;
  reviews: Review[];
  averageRating: number;
}

export default function ProductReview({ productId, reviews, averageRating }: ProductReviewProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const addReviewMutation = useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      const res = await apiRequest("POST", `/api/products/${productId}/reviews`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
      toast({
        title: t("products.reviews.success"),
        description: t("products.reviews.successDesc"),
      });
      setRating(5);
      setComment("");
    },
    onError: (error: Error) => {
      toast({
        title: t("products.reviews.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">{t("products.reviews.title")}</h3>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-5 w-5 ${
                star <= averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({reviews.length} {t("products.reviews.count")})
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">{t("products.reviews.writeReview")}</h4>
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`h-6 w-6 ${
                  star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("products.reviews.commentPlaceholder")}
          className="mb-4"
        />
        <Button
          onClick={() => addReviewMutation.mutate({ rating, comment })}
          disabled={!comment.trim() || addReviewMutation.isPending}
        >
          {t("products.reviews.submit")}
        </Button>
      </div>
    </div>
  );
}
