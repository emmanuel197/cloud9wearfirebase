import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  User,
  ShoppingCart,
  Menu,
  LogOut,
  LogIn,
  Home,
  Package,
  ShoppingBag,
  LayoutDashboard,
  Info,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Import logo 
import logoImg from "@/assets/cloud9-logo.jpg";

export default function Header() {
  const { t } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const { cart } = useCart();
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      scrolled ? "bg-black shadow-sm" : "bg-black"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <img 
                  src={logoImg} 
                  alt="Cloud9 Wear Logo" 
                  className="h-12 w-auto"
                />
              </a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <Link href="/">
              <a className={`font-medium ${location === "/" ? "text-white" : "text-gray-300 hover:text-white"} transition-colors`}>
                {t("navigation.home")}
              </a>
            </Link>
            <Link href="/products">
              <a className={`font-medium ${location === "/products" ? "text-white" : "text-gray-300 hover:text-white"} transition-colors`}>
                {t("navigation.products")}
              </a>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <a className={`font-medium ${location.startsWith("/admin") ? "text-white" : "text-gray-300 hover:text-white"} transition-colors`}>
                  {t("navigation.admin")}
                </a>
              </Link>
            )}
            {user?.role === "supplier" && (
              <Link href="/supplier">
                <a className={`font-medium ${location.startsWith("/supplier") ? "text-white" : "text-gray-300 hover:text-white"} transition-colors`}>
                  {t("navigation.supplier")}
                </a>
              </Link>
            )}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            {/* Auth / User Menu */}
            <div className="hidden md:block">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full text-white">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white text-black">
                          {getInitials(user.fullName || user.username || '')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black text-white border border-white">
                    <DropdownMenuLabel>{user.fullName || user.username}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs text-gray-400 font-normal">
                      {user.role}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <DropdownMenuItem>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>{t("navigation.adminDashboard")}</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {user.role === "supplier" && (
                      <Link href="/supplier">
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          <span>{t("navigation.supplierDashboard")}</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {user.role === "customer" && (
                      <Link href="/cart">
                        <DropdownMenuItem>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>{t("navigation.cart")}</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("navigation.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" className="flex items-center text-white hover:text-gray-300">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("navigation.login")}</span>
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Cart - Show on all screen sizes for customers */}
            {user?.role === "customer" && (
              <Link href="/cart">
                <Button variant="ghost" className="relative p-2 text-white hover:text-gray-300">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-gray-300">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white">
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <img 
                      src={logoImg} 
                      alt="Cloud9 Wear Logo" 
                      className="h-10 w-auto mr-2"
                    />
                  </SheetTitle>
                  <SheetDescription className="text-gray-300">
                    {t("navigation.mobileMenuDescription")}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link href="/" className="flex items-center py-2 px-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors">
                        <Home className="mr-2 h-4 w-4" />
                        {t("navigation.home")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/products" className="flex items-center py-2 px-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {t("navigation.products")}
                      </Link>
                    </SheetClose>
                    
                    {/* Role-specific links */}
                    {user?.role === "admin" && (
                      <SheetClose asChild>
                        <Link href="/admin" className="flex items-center py-2 px-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          {t("navigation.adminDashboard")}
                        </Link>
                      </SheetClose>
                    )}
                    {user?.role === "supplier" && (
                      <SheetClose asChild>
                        <Link href="/supplier" className="flex items-center py-2 px-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors">
                          <Package className="mr-2 h-4 w-4" />
                          {t("navigation.supplierDashboard")}
                        </Link>
                      </SheetClose>
                    )}
                    {user?.role === "customer" && (
                      <SheetClose asChild>
                        <Link href="/cart" className="flex items-center py-2 px-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {t("navigation.cart")}
                        </Link>
                      </SheetClose>
                    )}
                    
                    {/* Auth */}
                    {user ? (
                      <a 
                        className="flex items-center py-2 px-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                        onClick={() => {
                          handleLogout();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("navigation.logout")}
                      </a>
                    ) : (
                      <SheetClose asChild>
                        <Link href="/auth">
                          <a className="flex items-center py-2 px-3 rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors">
                            <LogIn className="mr-2 h-4 w-4" />
                            {t("navigation.login")}
                          </a>
                        </Link>
                      </SheetClose>
                    )}
                    
                    {/* Language */}
                    <div className="py-2 px-3">
                      <p className="text-sm font-medium mb-2">{t("navigation.language")}</p>
                      <LanguageSwitcher />
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
