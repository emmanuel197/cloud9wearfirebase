import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="dark-mode-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-subtle-on-dark">{title}</p>
            <p className="text-3xl font-bold text-on-dark">{value}</p>
            {description && <p className="text-sm text-subtle-on-dark mt-1">{description}</p>}
          </div>
          {icon && <div className="text-on-dark">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
