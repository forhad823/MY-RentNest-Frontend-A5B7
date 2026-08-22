"use client";

import { useState } from "react";
import { CreditCard, Loader2, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createCheckoutSession } from "@/service/payment";
import { Button } from "@/components/ui/button";

interface CheckoutClientProps {
  rentalRequestId: string;
  rentAmount: number;
  propertyTitle: string;
  propertyLocation: string;
}

export default function CheckoutClient({
  rentalRequestId,
  rentAmount,
  // propertyTitle,
  // propertyLocation,
}: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createCheckoutSession({ rentalRequestId });
      if (response.success && response.data?.checkoutUrl) {
        toast.success("Checkout session created! Redirecting to Stripe...");
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error(response.message || "Failed to initiate payment checkout session.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Stripe payment initiation error:", err);
      const errMsg = err.message || "An unexpected error occurred during Stripe initialization.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-600 dark:text-rose-400 flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Checkout Failed</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          asChild
          variant="outline"
          className="flex-1 order-2 sm:order-1"
          disabled={loading}
        >
          <Link href="/dashboard/tenant">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/95 order-1 sm:order-2 gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay Rent (${rentAmount})
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground border-t pt-4">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Secure 256-bit SSL Encrypted Payment via Stripe</span>
      </div>
    </div>
  );
}
