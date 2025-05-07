import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { CreditCard, Smartphone, Building } from "lucide-react";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const { t } = useLanguage();

  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
      <div>
        <Card className={`cursor-pointer hover:border-primary ${value === 'credit_card' ? 'border-primary' : ''}`}>
          <CardContent className="p-4">
            <RadioGroupItem value="credit_card" id="credit_card" className="sr-only" />
            <Label htmlFor="credit_card" className="flex items-center gap-3 cursor-pointer">
              <div className="bg-blue-50 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t("checkout.payment.creditCard.title")}</div>
                <div className="text-sm text-gray-500">{t("checkout.payment.creditCard.description")}</div>
              </div>
            </Label>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className={`cursor-pointer hover:border-primary ${value === 'mtn_mobile' ? 'border-primary' : ''}`}>
          <CardContent className="p-4">
            <RadioGroupItem value="mtn_mobile" id="mtn_mobile" className="sr-only" />
            <Label htmlFor="mtn_mobile" className="flex items-center gap-3 cursor-pointer">
              <div className="bg-yellow-50 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t("checkout.payment.mtnMobile.title")}</div>
                <div className="text-sm text-gray-500">{t("checkout.payment.mtnMobile.description")}</div>
              </div>
            </Label>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className={`cursor-pointer hover:border-primary ${value === 'telecel' ? 'border-primary' : ''}`}>
          <CardContent className="p-4">
            <RadioGroupItem value="telecel" id="telecel" className="sr-only" />
            <Label htmlFor="telecel" className="flex items-center gap-3 cursor-pointer">
              <div className="bg-red-50 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t("checkout.payment.telecel.title")}</div>
                <div className="text-sm text-gray-500">{t("checkout.payment.telecel.description")}</div>
              </div>
            </Label>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className={`cursor-pointer hover:border-primary ${value === 'bank_transfer' ? 'border-primary' : ''}`}>
          <CardContent className="p-4">
            <RadioGroupItem value="bank_transfer" id="bank_transfer" className="sr-only" />
            <Label htmlFor="bank_transfer" className="flex items-center gap-3 cursor-pointer">
              <div className="bg-green-50 p-2 rounded-full">
                <Building className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t("checkout.payment.bankTransfer.title")}</div>
                <div className="text-sm text-gray-500">{t("checkout.payment.bankTransfer.description")}</div>
              </div>
            </Label>
          </CardContent>
        </Card>
      </div>
    </RadioGroup>
  );
}
