import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  Star
} from "lucide-react";

export default function AdminSidebar() {
  const { t } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user || user.role !== "admin") {
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
      href: "/admin",
      label: t("admin.sidebar.dashboard"),
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />
    },
    {
      href: "/admin/orders",
      label: t("admin.sidebar.orders"),
      icon: <ShoppingBag className="h-5 w-5 mr-2" />
    },
    {
      href: "/admin/products",
      label: t("admin.sidebar.products"),
      icon: <Package className="h-5 w-5 mr-2" />
    },
    {
      href: "/admin/coming-soon",
      label: t("admin.sidebar.comingSoon") || "Coming Soon",
      icon: <Clock className="h-5 w-5 mr-2" />
    },
    {
      href: "/admin/reviews",
      label: t("admin.sidebar.reviews") || "Reviews",
      icon: <Star className="h-5 w-5 mr-2" />
    },
    {
      href: "/admin/customers",
      label: t("admin.sidebar.customers"),
      icon: <Users className="h-5 w-5 mr-2" />
    },
    {
      href: "/admin/suppliers",
      label: t("admin.sidebar.suppliers"),
      icon: <Users className="h-5 w-5 mr-2" />
    }
  ];

  return (
    <div className="h-screen w-64 border-r flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary">Cloud9wear</span>
          <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded">
            {t("admin.sidebar.adminPanel")}
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
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
              <a>
                <Button
                  variant={location === link.href ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    location === link.href ? "" : "hover:bg-gray-100"
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {location === link.href && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              </a>
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link href="/">
            <a>
              <Button variant="ghost" className="w-full justify-start hover:bg-gray-100">
                <ShoppingBag className="h-5 w-5 mr-2" />
                {t("admin.sidebar.storefront")}
              </Button>
            </a>
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
          {t("admin.sidebar.logout")}
        </Button>
      </div>
    </div>
  );
}
