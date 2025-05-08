import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube 
} from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-black text-white pt-10 md:pt-16 pb-6 md:pb-8 w-full">
      <div className="w-full max-w-[1980px] mx-auto px-[clamp(1rem,3vw,2rem)]">
        {/* Mobile accordion version could be added here for even better mobile UX */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-3 md:mb-4">Cloud9wear</h3>
            <p className="text-gray-400 mb-4 text-sm md:text-base">{t("footer.description")}</p>
            <div className="flex space-x-4">
              <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="sr-only">Facebook</span>
              </div>
              <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="sr-only">Twitter</span>
              </div>
              <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="sr-only">Instagram</span>
              </div>
              <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                <Youtube size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="sr-only">YouTube</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
              <li>
                <Link href="/">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("home")}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("products")}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("about")}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("contact")}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="col-span-1">
            <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-4">{t("footer.support")}</h4>
            <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
              <li>
                <Link href="/faq">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("faq")}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("shipping")}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("returns")}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="text-gray-400 hover:text-[#ef0c11] transition-colors cursor-pointer">
                    {t("privacy")}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info - Full width on mobile, normal on desktop */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mt-6 md:mt-0">
            <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  123 Fashion Street, Style City, SC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-gray-400" />
                <span className="text-gray-400">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-gray-400" />
                <span className="text-gray-400">info@cloud9wear.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom Section */}
        <div className="pt-6 md:pt-8 border-t border-gray-500 text-center text-gray-300 text-sm">
          <div className="flex justify-center space-x-4 mb-4">
            <LanguageSwitcher />
          </div>
          <p>
            &copy; {new Date().getFullYear()} Cloud9wear. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
