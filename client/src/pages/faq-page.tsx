import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Helmet } from "react-helmet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const { t } = useLanguage();

  // FAQ categories with their questions
  const faqCategories = [
    {
      category: "ordering",
      title: t("faq.categories.ordering"),
      questions: [
        "howToOrder",
        "paymentMethods",
        "orderCancellation",
        "editOrder"
      ]
    },
    {
      category: "shipping",
      title: t("faq.categories.shipping"),
      questions: [
        "deliveryTime",
        "shippingCost",
        "internationalShipping",
        "trackOrder"
      ]
    },
    {
      category: "returns",
      title: t("faq.categories.returns"),
      questions: [
        "returnPolicy",
        "exchangeProcess",
        "refundTimeline",
        "damagedItems"
      ]
    },
    {
      category: "products",
      title: t("faq.categories.products"),
      questions: [
        "sizing",
        "materials",
        "careInstructions",
        "customDesigns"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("faq.pageTitle")} | Cloud9wear</title>
        <meta name="description" content={t("faq.pageDescription")} />
      </Helmet>
      
      <div className="py-12 md:py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
          {t("faq.title")}
        </h1>
        
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-1 w-20 mx-auto mb-8"></div>
        
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          {t("faq.subtitle")}
        </p>
        
        {faqCategories.map((category) => (
          <section key={category.category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((question) => (
                <AccordionItem key={question} value={question}>
                  <AccordionTrigger className="text-left">
                    {t(`faq.questions.${category.category}.${question}.question`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 pb-1 text-gray-600">
                      {t(`faq.questions.${category.category}.${question}.answer`)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
        
        <div className="mt-12 text-center p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">{t("faq.stillHaveQuestions")}</h3>
          <p className="mb-4">{t("faq.contactUs")}</p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3"
          >
            {t("faq.contactButton")}
          </a>
        </div>
      </div>
    </>
  );
}