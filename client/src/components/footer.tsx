import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaCreditCard } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">KASA</h3>
            <p className="text-gray-400 mb-4">
              {t("footer.tagline")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Shop */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.shop")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products">
                  <a className="text-gray-400 hover:text-primary">{t("footer.allProducts")}</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=tshirts">
                  <a className="text-gray-400 hover:text-primary">{t("footer.tshirts")}</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=hoodies">
                  <a className="text-gray-400 hover:text-primary">{t("footer.hoodies")}</a>
                </Link>
              </li>
              <li>
                <Link href="/products?new=true">
                  <a className="text-gray-400 hover:text-primary">{t("footer.newArrivals")}</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.customerService")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-primary">{t("footer.contactUs")}</a>
                </Link>
              </li>
              <li>
                <Link href="/order-tracking">
                  <a className="text-gray-400 hover:text-primary">{t("footer.trackOrder")}</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-400 hover:text-primary">{t("footer.faq")}</a>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <a className="text-gray-400 hover:text-primary">{t("footer.returns")}</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.about")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-primary">{t("footer.aboutUs")}</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-primary">{t("footer.privacy")}</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-primary">{t("footer.terms")}</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-gray-400 hover:text-primary">{t("footer.careers")}</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} KASA. {t("footer.copyright")}
          </div>
          
          <div className="flex items-center">
            <div className="text-gray-400 mr-4">{t("footer.paymentMethods")}</div>
            <div className="flex space-x-3">
              <SiPaystack className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}