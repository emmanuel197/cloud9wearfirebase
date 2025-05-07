import { formatCurrency } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  className?: string;
}

export default function PriceDisplay({ amount, className = "" }: PriceDisplayProps) {
  return (
    <span className={className}>
      {formatCurrency(amount)}
    </span>
  );
}
