// -------- Payment Cancel Callback Page Component --------
import Link from "next/link";
import { AlertTriangle, ShieldCheck, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Payment Cancelled | RentNest",
  description: "The payment process was cancelled and no charges were made.",
};

export default async function PaymentCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="border shadow-lg text-center w-full">
        <CardHeader className="pb-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-3 animate-pulse">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-sm">
            The checkout session was closed without completing payment.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed px-6">
          <p>
            No money has been charged from your card. You can safely return to your Tenant Dashboard to review your applications or retry the payment process.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 px-6 pb-6">
          <Button asChild className="w-full gap-1.5 shadow-sm font-semibold">
            <Link href="/dashboard/tenant">
              Return to Dashboard (Retry Payment)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full gap-1.5">
            <Link href="/properties">
              <Home className="h-4 w-4" />
              Browse Properties
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6 flex items-center gap-1 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Secure Payment Integration powered by Stripe</span>
      </div>
    </div>
  );
}