// -------- Payment Success Callback Page Component --------
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Payment Successful | RentNest",
  description: "Your payment has been successfully processed and your rental is now active.",
};

export default async function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="border shadow-lg text-center w-full">
        <CardHeader className="pb-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-sm">
            Thank you! Your transaction has been processed securely.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed px-6">
          <p>
            Your payment checkout session completed successfully via Stripe. 
            The rental agreement is now <span className="text-emerald-600 font-bold uppercase">Active</span>.
          </p>
          <div className="p-3.5 rounded-xl bg-muted/40 border text-xs text-left space-y-1">
            <div className="flex justify-between">
              <span>Payment Type:</span>
              <span className="font-semibold text-foreground">Stripe Secure Card</span>
            </div>
            <div className="flex justify-between">
              <span>Lease Status:</span>
              <span className="font-semibold text-emerald-600">ACTIVE</span>
            </div>
          </div>
          <p className="text-[11px] italic">
            Note: It might take a minute for the landlord’s dashboard to reflect the updated status.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 px-6 pb-6">
          <Button asChild className="w-full gap-1.5 shadow-sm font-semibold">
            <Link href="/dashboard/tenant">
              Go to Tenant Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full gap-1.5">
            <Link href="/properties">
              Browse More Properties
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6 flex items-center gap-1 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Verified Checkout Protected by Stripe</span>
      </div>
    </div>
  );
}