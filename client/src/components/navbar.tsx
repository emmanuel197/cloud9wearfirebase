import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  User, 
  ShoppingCart, 
  LogOut, 
  LogIn,
  Home,
  Package,
  Search
} from "lucide-react";

export default function Navbar() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Links based on user role
  const getLinks = () => {
    const commonLinks = [
      { href: "/", label: t("navigation.home"), icon: <Home className="h-4 w-4 mr-2" /> },
      { href: "/products", label: t("navigation.products"), icon: <Search className="h-4 w-4 mr-2" /> },
    ];
    
    const trackOrderLink = { 
      href: "/order-tracking", 
      label: t("navigation.trackOrder"), 
      icon: <Package className="h-4 w-4 mr-2" /> 
    };

    if (user) {
      // Add role-specific links
      if (user.role === "admin") {
        return [
          ...commonLinks,
          { href: "/admin", label: t("navigation.adminDashboard"), icon: <User className="h-4 w-4 mr-2" /> },
        ];
      } else if (user.role === "supplier") {
        return [
          ...commonLinks,
          { href: "/supplier", label: t("navigation.supplierDashboard"), icon: <User className="h-4 w-4 mr-2" /> },
        ];
      } else {
        // Customer links
        // Always show trackOrder for logged-in customers
        return [
          ...commonLinks,
          trackOrderLink,
          { href: "/cart", label: t("navigation.cart"), icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
        ];
      }
    }

    return commonLinks;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const links = getLinks();

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black bg-opacity-95 shadow-md py-2"
          : "bg-black py-4"
      }`}
    >
      <div className="container flex justify-between items-center text-on-dark">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center">
            <span className="text-xl font-bold text-white hover:text-primary transition-colors">
              KASA
            </span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href}>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} ${
                        location === link.href
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <LanguageSwitcher />

          {user ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-1 border-white/30 text-white hover:text-primary hover:border-primary"
            >
              <LogOut className="h-4 w-4" />
              {t("navigation.logout")}
            </Button>
          ) : (
            <Button asChild variant="default">
              <Link href="/auth">
                <a className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  {t("navigation.login")}
                </a>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation (Hamburger Menu) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">KASA</SheetTitle>
              </SheetHeader>
              <div className="py-6 flex flex-col space-y-4">
                {links.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href}>
                      <a
                        className={`flex items-center py-3 px-4 rounded-md ${
                          location === link.href
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        {link.icon}
                        {link.label}
                      </a>
                    </Link>
                  </SheetClose>
                ))}

                <div className="pt-4 border-t border-border">
                  <LanguageSwitcher />
                </div>

                <div className="pt-4">
                  {user ? (
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("navigation.logout")}
                    </Button>
                  ) : (
                    <Button asChild className="w-full flex items-center justify-center gap-2">
                      <Link href="/auth">
                        <a>
                          <LogIn className="h-4 w-4 mr-2" />
                          {t("navigation.login")}
                        </a>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}