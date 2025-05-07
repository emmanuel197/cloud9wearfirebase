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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {icon && <div>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
