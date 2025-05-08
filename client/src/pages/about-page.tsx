import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Helmet } from "react-helmet";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("about.pageTitle")} | Cloud9wear</title>
        <meta name="description" content={t("about.pageDescription")} />
      </Helmet>
      
      <div className="py-12 md:py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
          {t("about.title")}
        </h1>
        
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-1 w-20 mx-auto mb-8"></div>
        
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t("about.ourStory.title")}</h2>
          <p className="mb-4 text-gray-700">
            {t("about.ourStory.part1")}
          </p>
          <p className="text-gray-700">
            {t("about.ourStory.part2")}
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t("about.ourMission.title")}</h2>
          <p className="text-gray-700">
            {t("about.ourMission.content")}
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t("about.quality.title")}</h2>
          <p className="text-gray-700">
            {t("about.quality.content")}
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t("about.sustainability.title")}</h2>
          <p className="text-gray-700">
            {t("about.sustainability.content")}
          </p>
        </section>
      </div>
    </>
  );
}