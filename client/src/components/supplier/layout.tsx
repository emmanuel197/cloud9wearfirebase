import React, { ReactNode } from "react";
import SupplierSidebar from "./sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

interface SupplierLayoutProps {
  children: ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== "supplier") {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SupplierSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}