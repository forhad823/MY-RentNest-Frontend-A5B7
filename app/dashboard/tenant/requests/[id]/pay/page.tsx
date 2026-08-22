// -------- Stripe Payment Initiation Page Component --------
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CreditCard,  MapPin, AlertTriangle } from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getRentalRequestById } from "@/service/rental";
import { getPropertyById } from "@/service/property";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CheckoutClient from "@/components/checkout/CheckoutClient";


interface PayPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Initiate Rent Payment | RentNest",
  description: "Complete checkout using Stripe to activate your approved rental request.",
};

export default async function PayPage({ params }: PayPageProps) {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect(`/login?redirectTo=/dashboard/tenant`);
  }

  if (session.user.role !== "TENANT") {
    redirect("/");
  }

  const { id } = await params;

  let rentalRequest;
  try {
    const requestRes = await getRentalRequestById(id);
    rentalRequest = requestRes.data;
  } catch (err) {
    console.error("Error fetching rental request:", err);
  }

  if (!rentalRequest) {
    notFound();
  }

  // Hydrate property details if missing
  let property = rentalRequest.property;
  if (!property) {
    try {
      const propertyRes = await getPropertyById(rentalRequest.propertyId);
      property = propertyRes.data || undefined;
    } catch (err) {
      console.error("Error fetching property details:", err);
    }
  }

  const isApproved = rentalRequest.status === "APPROVED";
  const formattedDate = new Date(rentalRequest.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="space-y-6">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <CreditCard className="h-8 w-8 text-primary" />
            Complete Rent Payment
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Review and complete your payment to finalize lease activation.
          </p>
        </div>

        {/* Not Approved Warning State */}
        {!isApproved ? (
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Payment Unavailable
              </CardTitle>
              <CardDescription>
                This rental request is not in a payable status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Payments can only be initiated for requests that have been approved by the landlord. 
                Your request status is currently <span className="font-bold uppercase text-foreground">{rentalRequest.status}</span>.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/tenant">Back to Tenant Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* Checkout Billing details and action card */
          <Card className="border shadow-md overflow-hidden">
            <CardHeader className="border-b bg-muted/20 pb-5">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Approved Request
                  </span>
                  <CardTitle className="text-lg font-bold mt-2">
                    {property?.title || "Rental Property Lease"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {property?.location || "Location not specified"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold text-primary">
                    ${rentalRequest.rentAmount}
                  </div>
                  <span className="text-[11px] text-muted-foreground">Monthly Rent</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Application Date</span>
                  <span className="font-medium text-foreground">{formattedDate}</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Rental ID</span>
                  <span className="font-mono text-xs text-foreground">
                    #{rentalRequest.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span className="font-medium text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-base font-bold text-foreground">Due Now</span>
                  <span className="text-base font-bold text-primary">
                    ${rentalRequest.rentAmount}.00
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Checkout Client Integration Button and Alerts */}
              <CheckoutClient 
                rentalRequestId={rentalRequest.id} 
                rentAmount={rentalRequest.rentAmount} 
                propertyTitle={property?.title || ""}
                propertyLocation={property?.location || ""}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}