import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

interface TopReviewData {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    id: number;
    name: string;
    imageUrl: string;
  } | null;
  customer: {
    id: number;
    fullName: string;
  } | null;
}

export default function TopReviews() {
  const { t } = useLanguage();
  const [limit, setLimit] = useState(5);
  
  const { data: reviews, isLoading } = useQuery<TopReviewData[]>({
    queryKey: ["/api/reviews/top", limit],
    enabled: true,
  });
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <StarIcon 
            key={index} 
            className={`h-4 w-4 ${index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };
  
  const renderInitials = (name: string) => {
    if (!name) return "CU";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (isLoading) {
    return (
      <div className="py-10">
        <h2 className="text-2xl font-bold text-center mb-8">{t("topReviews")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!reviews || reviews.length === 0) {
    return null;
  }
  
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-center mb-8">{t("topReviews")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarFallback>
                    {renderInitials(review.customer?.fullName || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {review.customer?.fullName || t("customer")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {review.product?.name || ""}
                  </div>
                </div>
              </div>
              <div className="mb-2">{renderStars(review.rating)}</div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}