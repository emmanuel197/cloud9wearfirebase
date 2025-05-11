import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertOrderSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import PaymentMethodSelector from "@/components/payment-method-selector";
import PriceDisplay from "@/components/price-display";
import { PaystackButton } from "@/components/paystack-button";

// Extend the order schema for the checkout form
const checkoutFormSchema = z.object({
  shippingAddress: z.string().min(5, "Shipping address is required"),
  contactPhone: z.string().min(5, "Contact phone is required"),
  paymentMethod: z.enum(
    ["credit_card", "mtn_mobile", "telecel", "bank_transfer"],
    {
      required_error: "Please select a payment method",
    },
  ),
  customerEmail: z.string().email("Valid email is required for payment"),
});

