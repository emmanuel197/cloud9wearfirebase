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
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">ExclusiveWear</h3>
            <p className="text-gray-400 mb-4">{t("footer.description")}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={18} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.links.home")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.links.products")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.links.about")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.links.contact")}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.support.faq")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.support.shipping")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.support.returns")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.support.privacy")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.support.terms")}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  123 Fashion Street, Style City, SC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-gray-400">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-gray-400">info@exclusivewear.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 text-center text-gray-500">
          <div className="flex justify-center space-x-4 mb-4">
            <LanguageSwitcher />
          </div>
          <p>
            &copy; {new Date().getFullYear()} ExclusiveWear. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
