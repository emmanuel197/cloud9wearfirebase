import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { normalizeImageUrl } from "@/lib/imageUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  
  // Fetch top reviews
  const { data: reviews = [], isLoading } = useQuery<TopReviewData[]>({
    queryKey: ["/api/reviews/top"],
    queryFn: () => fetch('/api/reviews/top?limit=8').then(res => res.json()),
  });

  // Function to render stars for a rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("home.topReviews")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-gray-200 rounded-t-lg" />
                <CardContent className="space-y-2 pt-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-20 bg-gray-200 rounded mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-2">
          {t("home.topReviews")}
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          {t("home.topReviewsSubtitle")}
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">
                          {review.customer?.fullName || t("reviews.anonymousUser")}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-700 line-clamp-4">
                      "{review.comment}"
                    </p>
                  </CardContent>
                  {review.product && (
                    <CardFooter className="border-t pt-4 mt-auto">
                      <Link to={`/products/${review.product.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          <img 
                            src={normalizeImageUrl(review.product.imageUrl)} 
                            alt={review.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{review.product.name}</p>
                          <p className="text-xs text-muted-foreground">{t("reviews.viewProduct")}</p>
                        </div>
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative mr-2 static left-auto translate-x-0" />
            <CarouselNext className="relative ml-2 static right-auto translate-x-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}