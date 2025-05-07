import { useLanguage } from "@/hooks/use-language";

interface PriceDisplayProps {
  amount: number;
  className?: string;
}

export default function PriceDisplay({ amount, className = "" }: PriceDisplayProps) {
  const { language } = useLanguage();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <span className={className}>
      {formatCurrency(amount)}
    </span>
  );
}
