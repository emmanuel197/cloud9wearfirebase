import { useEffect, useState } from "react";
import { useLocation, useParams, Redirect } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Get the reference from the URL
  const location = useLocation();
  const urlParams = new URLSearchParams(location[0].split('?')[1] || '');
  const reference = urlParams.get('reference');
  
  // Verify payment status
  const verifyPaymentMutation = useMutation({
    mutationFn: async (reference: string) => {
      const res = await apiRequest("GET", `/api/payments/verify/${reference}`);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setVerificationStatus('success');
        if (data.data && data.data.metadata && data.data.metadata.orderId) {
          setOrderId(parseInt(data.data.metadata.orderId));
        }
        toast({
          title: t("payment.success.title"),
          description: t("payment.success.description"),
        });
      } else {
        setVerificationStatus('error');
        toast({
          title: t("payment.error.title"),
          description: data.message || t("payment.error.description"),
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      setVerificationStatus('error');
      toast({
        title: t("payment.error.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  useEffect(() => {
    // Verify payment if reference is available
    if (reference) {
      verifyPaymentMutation.mutate(reference);
    } else {
      setVerificationStatus('error');
    }
  }, [reference]);
  
  // Loading view
  if (verificationStatus === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">{t("payment.verifying.title")}</CardTitle>
            <CardDescription>{t("payment.verifying.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>{t("payment.verifying.please_wait")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Error view
  if (verificationStatus === 'error') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">{t("payment.error.title")}</CardTitle>
            <CardDescription>{t("payment.error.description")}</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <p className="mb-6">{t("payment.error.try_again")}</p>
            <div className="flex justify-center space-x-4">
              <Link href="/checkout">
                <Button>
                  {t("payment.error.go_to_checkout")}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  {t("payment.error.go_to_home")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Success view
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t("payment.success.title")}</CardTitle>
          <CardDescription>{t("payment.success.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {orderId && (
            <p className="mb-4">{t("payment.success.order_number")}: <span className="font-semibold">#{orderId}</span></p>
          )}
          <p className="mb-6">{t("payment.success.confirmation_email")}</p>
          <div className="flex justify-center space-x-4">
            <Link href={orderId ? `/orders/${orderId}` : "/orders"}>
              <Button>
                {t("payment.success.view_order")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                {t("payment.success.continue_shopping")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}