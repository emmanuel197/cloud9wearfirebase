import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  PlusCircle
} from "lucide-react";

export default function SupplierSidebar() {
  const { t } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user || user.role !== "supplier") {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const links = [
    {
      href: "/supplier",
      label: t("supplier.sidebar.dashboard"),
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />
    },
    {
      href: "/supplier/inventory",
      label: t("supplier.sidebar.inventory"),
      icon: <Package className="h-5 w-5 mr-2" />
    },
    {
      href: "/supplier/add-products",
      label: t("supplier.inventory.addProducts"),
      icon: <PlusCircle className="h-5 w-5 mr-2" />
    },
    {
      href: "/supplier/orders",
      label: t("supplier.sidebar.orders"),
      icon: <ShoppingBag className="h-5 w-5 mr-2" />
    }
  ];

  return (
    <div className="h-screen w-64 border-r flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary">Cloud9wear</span>
          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
            {t("supplier.sidebar.supplierPanel")}
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-green-500 text-white">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "default" : "ghost"}
                className={`w-full justify-start text-gray-800 ${
                  location === link.href ? "bg-black text-white hover:bg-black/90" : "hover:bg-gray-100 hover:text-black"
                }`}
              >
                {link.icon}
                {link.label}
                {location === link.href && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-gray-800 hover:bg-gray-100 hover:text-black">
              <ShoppingBag className="h-5 w-5 mr-2" />
              {t("supplier.sidebar.storefront")}
            </Button>
          </Link>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t("supplier.sidebar.logout")}
        </Button>
      </div>
    </div>
  );
}
