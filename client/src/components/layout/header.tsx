import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/use-language";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import logoImage from "../../assets/photo_2025-05-08_15.42.27-removebg-preview.png";
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
      <div className="w-full max-w-[1980px] mx-auto px-[clamp(1rem,3vw,2rem)] relative">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src={logoImage} 
                  alt="Cloud9wear Logo" 
                  className="h-[50px] w-[170px] object-cover"
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <Link href="/">
              <div className={`font-medium ${location === "/" ? "text-white font-bold" : "text-gray-300 hover:text-white"} transition-colors cursor-pointer`}>
                {t("navigation.home")}
              </div>
            </Link>
            <Link href="/products">
              <div className={`font-medium ${location === "/products" ? "text-white font-bold" : "text-gray-300 hover:text-white"} transition-colors cursor-pointer`}>
                {t("navigation.products")}
              </div>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <div className={`font-medium ${location.startsWith("/admin") ? "text-white font-bold" : "text-gray-300 hover:text-white"} transition-colors cursor-pointer`}>
                  {t("navigation.admin")}
                </div>
              </Link>
            )}
            {user?.role === "supplier" && (
              <Link href="/supplier">
                <div className={`font-medium ${location.startsWith("/supplier") ? "text-white font-bold" : "text-gray-300 hover:text-white"} transition-colors cursor-pointer`}>
                  {t("navigation.supplier")}
                </div>
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
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full text-white hover:text-white hover:bg-black/60">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white text-black">
                          {getInitials(user.fullName || user.username || '')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.fullName || user.username}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
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
                  <Button variant="ghost" className="flex items-center text-white hover:text-white hover:bg-black/60">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("navigation.login")}</span>
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Cart - Show on all screen sizes for customers */}
            {user?.role === "customer" && (
              <Link href="/cart">
                <Button variant="ghost" className="relative p-2 text-white hover:text-white hover:bg-black/60">
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
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white hover:bg-black/60">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-center">
                    <img 
                      src={logoImage} 
                      alt="Cloud9wear Logo" 
                      className="h-[50px] w-[170px] object-cover"
                    />
                  </SheetTitle>
                  <SheetDescription>
                    {t("navigation.mobileMenuDescription")}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link href="/">
                        <div className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <Home className="mr-2 h-4 w-4" />
                          {t("navigation.home")}
                        </div>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/products">
                        <div className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          {t("navigation.products")}
                        </div>
                      </Link>
                    </SheetClose>
                    
                    {/* Role-specific links */}
                    {user?.role === "admin" && (
                      <SheetClose asChild>
                        <Link href="/admin">
                          <div className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            {t("navigation.adminDashboard")}
                          </div>
                        </Link>
                      </SheetClose>
                    )}
                    {user?.role === "supplier" && (
                      <SheetClose asChild>
                        <Link href="/supplier">
                          <div className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            {t("navigation.supplierDashboard")}
                          </div>
                        </Link>
                      </SheetClose>
                    )}
                    {user?.role === "customer" && (
                      <SheetClose asChild>
                        <Link href="/cart">
                          <div className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {t("navigation.cart")}
                          </div>
                        </Link>
                      </SheetClose>
                    )}
                    
                    {/* Auth */}
                    {user ? (
                      <a 
                        className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer"
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
                          <div className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <LogIn className="mr-2 h-4 w-4" />
                            {t("navigation.login")}
                          </div>
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
