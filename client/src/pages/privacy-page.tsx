import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Helmet } from "react-helmet";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("privacy.pageTitle")} | Cloud9wear</title>
        <meta name="description" content={t("privacy.pageDescription")} />
      </Helmet>
      
      <div className="py-12 md:py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
          {t("privacy.title")}
        </h1>
        
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-1 w-20 mx-auto mb-8"></div>
        
        <p className="text-gray-600 mb-10">
          {t("privacy.lastUpdated")}: May 1, 2025
        </p>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.introduction.title")}</h2>
            <p className="mb-4">
              {t("privacy.sections.introduction.p1")}
            </p>
            <p>
              {t("privacy.sections.introduction.p2")}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.information.title")}</h2>
            <p className="mb-4">
              {t("privacy.sections.information.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>{t("privacy.sections.information.list.item1")}</li>
              <li>{t("privacy.sections.information.list.item2")}</li>
              <li>{t("privacy.sections.information.list.item3")}</li>
              <li>{t("privacy.sections.information.list.item4")}</li>
              <li>{t("privacy.sections.information.list.item5")}</li>
            </ul>
            <p>
              {t("privacy.sections.information.p2")}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.use.title")}</h2>
            <p className="mb-4">
              {t("privacy.sections.use.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("privacy.sections.use.list.item1")}</li>
              <li>{t("privacy.sections.use.list.item2")}</li>
              <li>{t("privacy.sections.use.list.item3")}</li>
              <li>{t("privacy.sections.use.list.item4")}</li>
              <li>{t("privacy.sections.use.list.item5")}</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.sharing.title")}</h2>
            <p className="mb-4">
              {t("privacy.sections.sharing.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("privacy.sections.sharing.list.item1")}</li>
              <li>{t("privacy.sections.sharing.list.item2")}</li>
              <li>{t("privacy.sections.sharing.list.item3")}</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.cookies.title")}</h2>
            <p className="mb-4">
              {t("privacy.sections.cookies.p1")}
            </p>
            <p>
              {t("privacy.sections.cookies.p2")}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.security.title")}</h2>
            <p>
              {t("privacy.sections.security.p1")}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.rights.title")}</h2>
            <p className="mb-4">
              {t("privacy.sections.rights.p1")}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("privacy.sections.rights.list.item1")}</li>
              <li>{t("privacy.sections.rights.list.item2")}</li>
              <li>{t("privacy.sections.rights.list.item3")}</li>
              <li>{t("privacy.sections.rights.list.item4")}</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.changes.title")}</h2>
            <p>
              {t("privacy.sections.changes.p1")}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("privacy.sections.contact.title")}</h2>
            <p>
              {t("privacy.sections.contact.p1")}
            </p>
            <div className="mt-4">
              <p><strong>Email:</strong> privacy@cloud9wear.com</p>
              <p><strong>{t("privacy.sections.contact.address")}:</strong> 123 Fashion Street, Style City, SC 12345, Ghana</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}