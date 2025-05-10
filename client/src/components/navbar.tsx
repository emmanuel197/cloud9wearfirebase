import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
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

  // Query to check if user has any orders
  const { data: orders } = useQuery({
    queryKey: ["/api/user-orders"],
    queryFn: async () => {
      if (!user || user.role !== "customer") return null;
      const res = await fetch("/api/orders?customerId=" + user.id);
      if (!res.ok) return [];
      return await res.json();
    },
    enabled: !!user && user.role === "customer",
  });
  
  // Links based on user role
  const getLinks = () => {
    const commonLinks = [
      { href: "/", label: t("navigation.home"), icon: <Home className="h-4 w-4 mr-2" /> },
      { href: "/products", label: t("navigation.products"), icon: <Search className="h-4 w-4 mr-2" /> },
    ];
    
    // Only create this link if needed
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
          trackOrderLink, // Admin can always see/test this
          { href: "/admin", label: t("navigation.adminDashboard"), icon: <User className="h-4 w-4 mr-2" /> },
        ];
      } else if (user.role === "supplier") {
        return [
          ...commonLinks,
          { href: "/supplier", label: t("navigation.supplierDashboard"), icon: <User className="h-4 w-4 mr-2" /> },
        ];
      } else {
        // Customer links
        const customerLinks = [
          ...commonLinks,
          { href: "/cart", label: t("navigation.cart"), icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
        ];
        
        // Always show track order link for customers
        customerLinks.splice(2, 0, trackOrderLink);
        return customerLinks;
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
              {/* Home and Products links */}
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      location === "/"
                        ? "bg-primary/10 text-primary"
                        : ""
                    }`}
                  >
                    {t("navigation.home")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/products">
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      location === "/products"
                        ? "bg-primary/10 text-primary"
                        : ""
                    }`}
                  >
                    {t("navigation.products")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              {/* Order Tracking Link - Only for authenticated customers or admin */}
              {user && (user.role === "customer" || user.role === "admin") && (
                <NavigationMenuItem>
                  <Link href="/order-tracking">
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} ${
                        location === "/order-tracking"
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {t("navigation.trackOrder")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              
              {/* Cart Link - Only for customers */}
              {user && user.role === "customer" && (
                <NavigationMenuItem>
                  <Link href="/cart">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        location === "/cart"
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {t("navigation.cart")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              
              {/* Admin/Supplier Dashboard Links */}
              {user && user.role === "admin" && (
                <NavigationMenuItem>
                  <Link href="/admin">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        location === "/admin"
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {t("navigation.adminDashboard")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              
              {user && user.role === "supplier" && (
                <NavigationMenuItem>
                  <Link href="/supplier">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        location === "/supplier"
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      {t("navigation.supplierDashboard")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
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
                {/* Home link */}
                <SheetClose asChild>
                  <Link href="/">
                    <a
                      className={`flex items-center py-3 px-4 rounded-md ${
                        location === "/"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      {t("navigation.home")}
                    </a>
                  </Link>
                </SheetClose>
                
                {/* Products link */}
                <SheetClose asChild>
                  <Link href="/products">
                    <a
                      className={`flex items-center py-3 px-4 rounded-md ${
                        location === "/products"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {t("navigation.products")}
                    </a>
                  </Link>
                </SheetClose>
                
                {/* Order Tracking Link - Only for authenticated customers or admin */}
                {user && (user.role === "customer" || user.role === "admin") && (
                  <SheetClose asChild>
                    <Link href="/order-tracking">
                      <a
                        className={`flex items-center py-3 px-4 rounded-md ${
                          location === "/order-tracking"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        {t("navigation.trackOrder")}
                      </a>
                    </Link>
                  </SheetClose>
                )}
                
                {/* Cart link - Only for customers */}
                {user && user.role === "customer" && (
                  <SheetClose asChild>
                    <Link href="/cart">
                      <a
                        className={`flex items-center py-3 px-4 rounded-md ${
                          location === "/cart"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t("navigation.cart")}
                      </a>
                    </Link>
                  </SheetClose>
                )}
                
                {/* Admin Dashboard Link */}
                {user && user.role === "admin" && (
                  <SheetClose asChild>
                    <Link href="/admin">
                      <a
                        className={`flex items-center py-3 px-4 rounded-md ${
                          location === "/admin"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t("navigation.adminDashboard")}
                      </a>
                    </Link>
                  </SheetClose>
                )}
                
                {/* Supplier Dashboard Link */}
                {user && user.role === "supplier" && (
                  <SheetClose asChild>
                    <Link href="/supplier">
                      <a
                        className={`flex items-center py-3 px-4 rounded-md ${
                          location === "/supplier"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t("navigation.supplierDashboard")}
                      </a>
                    </Link>
                  </SheetClose>
                )}

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