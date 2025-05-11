import React, { createContext, useState, useEffect, useContext } from "react";
import enTranslations from "@/translations/en";
import frTranslations from "@/translations/fr";
import esTranslations from "@/translations/es";
import deTranslations from "@/translations/de";

export const LanguageContext = createContext(undefined);

const translations = {
  en: enTranslations,
  fr: frTranslations,
  es: esTranslations,
  de: deTranslations,
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get the saved language from localStorage, or fallback to browser language, or "en"
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split("-")[0];
    return Object.keys(translations).includes(browserLang) ? browserLang : "en";
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const translate = (key, params) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      if (!value[k]) {
        // Fallback to English if translation doesn't exist
        value = translations["en"];
        for (const fallbackKey of keys) {
          if (!value[fallbackKey]) {
            return key; // Return the key if translation not found in fallback
          }
          value = value[fallbackKey];
        }
        break;
      }
      value = value[k];
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`\\{${paramKey}\\}`, "g"), paramValue);
      }, value);
    }

    return value;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translate,
        translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}