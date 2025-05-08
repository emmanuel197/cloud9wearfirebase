import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import ProductGrid from "@/components/product-grid";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "../assets/hero-image.jpeg";

export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white py-16 w-full max-w-none">
        <div className="max-w-[1980px] mx-auto px-4 w-full">
          <div className="flex flex-col md:flex-row items-center w-full">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("hero.title")}
              </h1>
              <p className="text-lg mb-8">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-[#ef0c11] hover:bg-[#ef0c11]/80 text-white"
                  >
                    {t("hero.browseButton")}
                  </Button>
                </Link>
                {!user && (
                  <Link href="/auth">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white hover:bg-white text-black border-white hover:text-[#ef0c11]"
                    >
                      {t("hero.registerButton")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src={heroImage}
                alt="Collection of exclusive designer t-shirts"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center text-black">
            {t("featuredProducts.title")}
          </h2>
          <p className="text-gray-700 text-center mb-12">
            {t("featuredProducts.subtitle")}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="w-full h-64" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products?.slice(0, 4) || []} />
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="border-[#ef0c11] text-[#ef0c11] hover:bg-[#ef0c11] hover:text-white">
                {t("featuredProducts.viewAllButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Payment Options Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center text-black">{t("payment.title")}</h2>
          <p className="text-gray-700 text-center mb-12">{t("payment.subtitle")}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Credit Card Payment */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-[#ef0c11] transition-colors">
              <div className="mb-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <CreditCardIcon className="text-[#ef0c11] text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">{t("payment.creditCard.title")}</h3>
                <p className="text-gray-700">{t("payment.creditCard.description")}</p>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <IconVisa className="text-gray-800 text-3xl" />
                <IconMastercard className="text-gray-800 text-3xl" />
                <IconAmex className="text-gray-800 text-3xl" />
              </div>
            </div>
            
            {/* Mobile Money Payment */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-[#ef0c11] transition-colors">
              <div className="mb-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-full mb-4">
                  <SmartphoneIcon className="text-[#ef0c11] text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">{t("payment.mobileMoney.title")}</h3>
                <p className="text-gray-700">{t("payment.mobileMoney.description")}</p>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">MTN Money</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Telecel</span>
              </div>
            </div>
            
            {/* Bank Transfer Payment */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-[#ef0c11] transition-colors">
              <div className="mb-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <BuildingIcon className="text-[#ef0c11] text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">{t("payment.bankTransfer.title")}</h3>
                <p className="text-gray-700">{t("payment.bankTransfer.description")}</p>
              </div>
              <div className="flex justify-center mt-6">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{t("payment.bankTransfer.badge")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pb-32 bg-black w-full max-w-none mb-12">
        <div className="max-w-[1980px] mx-auto px-4 text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t("cta.title")}</h2>
          <p className="text-white opacity-90 text-lg mb-12 max-w-3xl mx-auto">{t("cta.description")}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth">
              <Button size="lg" className="bg-white hover:bg-white text-black hover:text-[#ef0c11]">
                {t("cta.signupButton")}
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-[#ef0c11] border-2 border-white text-white">
                {t("cta.exploreButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  );
}

function CreditCardIcon(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  );
}

function SmartphoneIcon(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
      <line x1="12" x2="12.01" y1="18" y2="18"/>
    </svg>
  );
}

function BuildingIcon(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  );
}

function IconVisa(props: any) {
  return (
    <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="visa-label" {...props}>
      <title id="visa-label">Visa</title>
      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" fill="#fff"/>
      <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z" fill="#fff"/>
      <path d="M4.983 12.986c.12-.607.56-1.492 1.56-1.492.52 0 1.16.367 1.1 1.138-.06.773-.68 1.533-1.56 1.533-.4 0-1.1-.152-1.1-1.18Zm12.641 2.299h-1.56c-.2 0-.38-.152-.38-.334v-4.895c0-.183.18-.335.38-.335h1.52c.2 0 .38.152.38.334v4.895c.04.182-.14.334-.34.334v.001Zm-5.64.092c-.613 0-1.1-.273-1.54-.94l-2.22.092v.001l1.38-3.317h-.82c-.24 0-.52.046-.68.198-.14.153-.3.396-.3.396h-1.56c0-.152.52-2.634 3.04-2.634h3.08l-1.54 3.805 1.2.244c.66.122 1.1.396 1.1 1.214-.04.79-.76 1.043-1.14.941Zm7.12-.092h-2.52l1.88-4.713h-1.42c-.06 0-.06.030-.06.092-.66.152-2.96 4.591-2.96 4.591-.06.031-.12.031-.12.031h-1.56V10.49c0-.121.06-.243.24-.304.18-.06.32-.06.32-.06h1.4l.88-2.121c.06-.153.14-.214.28-.214h2.5c.04 0 .08.03.06.061 0 .03 0 .03-.02.061l-1.3 3.257h1.54c.04 0 .06 0 .08.03.06.03-.06.092-.06.092l-.6 1.48v.06s0 .03-.02.03c0 0-.2.031-.8.031Z" fill="#172B85"/>
      <path d="M27.205 15.377h-2.4c-.06 0-.12-.03-.18-.091l-1.52-3.226c-.06-.092-.14-.092-.2 0l-.82 1.98c-.6.121-.1.213-.26.213h-1.52c-.08 0-.1-.03-.06-.092l1.92-4.53c.06-.091.1-.152.24-.152h1.5c.06 0 .12.03.16.092l2.16 5.074c.08.122.6.152-.02.152-.6.091-.6.091-.06.091v.489Zm-10.006-5.678H15.68c-.12 0-.2.06-.2.152-.04.03-.02.03-.2.091l-1.2 2.878-.28.671c0 .03 0 .03-.2.061-.2.03-.4.061-.6.061s-.06 0-.08-.03c0-.03-.02-.03-.02-.061l-.12-.274c-.16-.304-.52-1.187-.52-1.187s-.52 1.187-.68 1.552c0 .03-.2.03-.2.061-.2.03-.6.061-.8.061-.06 0-.08-.03-.08-.061-.02-.03-.02-.061-.02-.061L10.96 9.85c0-.03-.02-.03-.02-.061-.02-.03-.06-.091-.06-.091-.04-.061-.12-.091-.18-.091H9.02c-.04 0-.06 0-.08-.03-.04-.03-.04-.061 0-.122L11.88 5.11c.04-.091.1-.152.24-.152h1.48c.06 0 .1.03.14.091l3.52 4.59c.02.03.02.061 0 .091-.2.031-.4.061-.08.061v-.091h-.003Z" fill="#172B85"/>
      <path d="m35.48 15.377-2.36-5.104c0-.03-.02-.03-.02-.061-.02-.03-.04-.061-.1-.061h-1.38c-.08 0-.16.061-.2.152l-1.98 4.53c-.4.091-.2.091.04.091h1.52c.12 0 .18-.091.22-.152l.36-.823h1.88l.38.853c.4.091.8.152.2.152h1.48c.06 0 .08-.03.08-.061a.09.09 0 0 0-.06-.091v.575Zm-3.92-2.33.56-1.461h.02l.6 1.461h-1.18Z" fill="#172B85"/>
      <path d="m10.542 15.286-1.42-3.996s-.06-.152-.24-.213c-.18-.06-.82-.152-.82-.152s-.16-.03-.24-.03H6.304c-.04 0-.08 0-.06-.06 0-.03 0-.03.02-.061l.08-.152c.22-.334.66-.486 1.1-.486h.7c.04 0 .08-.03.1-.061l.26-.578c.02-.03.02-.061 0-.091-.02-.03-.04-.03-.08-.03h-2.1c-.08 0-.14.061-.16.152l-1.84 4.26c-.4.091 0 .122.04.122l.64.274c.06.03.14.03.2.03h2.8c.06 0 .12-.03.14-.091l.2-.518c.02-.061 0-.091-.04-.091h-.76c-.08 0-.12-.061-.1-.122l.04-.121c.02-.061.06-.091.14-.091h.88c.08 0 .12-.061.14-.122l.18-.486c.02-.061 0-.091-.04-.091h-.7c-.06 0-.08-.03-.06-.091l.04-.122c.02-.03.06-.091.12-.091h.72c.10.001.14-.03.16-.152Z" fill="#172B85"/>
    </svg>
  );
}

function IconMastercard(props: any) {
  return (
    <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="mastercard-label" {...props}>
      <title id="mastercard-label">Mastercard</title>
      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" fill="#fff"/>
      <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z" fill="#fff"/>
      <path d="M15 19C8.9 19 4 14.1 4 8S8.9-3 15-3c3.5 0 6.6 1.6 8.7 4.1-1.7-3.5-5.3-5.9-9.5-5.9C7.3-4.8 1.8.7 1.8 7.6s5.5 12.4 12.4 12.4c4.2 0 7.8-2.4 9.5-5.9-2.1 2.5-5.2 4.1-8.7 4.1v.8Z" fill="#FF5F00"/>
      <path d="M22.3 4.1C24.9 6.6 26.4 10 26.4 14c0 3.9-1.5 7.3-4.1 9.9 2.6-2.5 4.1-5.9 4.1-9.9 0-4-1.5-7.4-4.1-9.9Z" fill="#EB001B"/>
      <path d="M22.3 4.1C19.7 1.6 16.3 0 12.4 0 7.3 0 3 2.2.9 5.6c2-3.1 5.5-5.2 9.5-5.2 3.9 0 7.3 1.6 9.9 4.1v-.4Z" fill="#F79E1B"/>
    </svg>
  );
}

function IconAmex(props: any) {
  return (
    <svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="amex-label" {...props}>
      <title id="amex-label">American Express</title>
      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" fill="#fff"/>
      <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z" fill="#fff"/>
      <path d="M20.4 12.1v-1.2h3.2v-1.7h-3.2V8h3.2V6.3h-5.3v7.5h5.4v-1.7h-3.3ZM33.3 10l-1.1-3.7h-2.4L27.5 12v1.8h3v1.8H33V12h1.1v-2H33Zm-2.8 0h-1.8l.9-2.4.9 2.4ZM4.8 9.1h1.5l1.4 3.3v-3.3h1.3l1.5 2.3v-2.3h1.7v4.6h-2l-1.6-2.6v2.6h-2.5l-.3-.8H3.6l-.3.8H1l2-4.6h1.8Zm-.8 2.9.6-1.4.5 1.4H4ZM11.3 9.1h-2.7v4.6h2.7v-1.5h-1v-3.1Z" fill="#006FCF"/>
    </svg>
  );
}
