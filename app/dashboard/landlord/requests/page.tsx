// -------- Landlord Requests Management Page Component --------
import { redirect } from "next/navigation";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getServerSession } from "@/lib/auth-session";
import { getLandlordRentalRequests } from "@/service/landlord";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestsClientTable from "../../../../components/landlordRelated/RequestsClientTable";

export const metadata = {
  title: "Rental Applications | RentNest Landlord",
  description: "Review and approve/reject incoming tenant rental applications.",
};

export default async function LandlordRequestsPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/landlord/requests");
  }

  if (session.user.role !== "LANDLORD") {
    redirect("/");
  }

  const response = await getLandlordRentalRequests();
  const requests = response.data || [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Link
              href="/dashboard/landlord"
              className="hover:underline hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Landlord Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1 flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Incoming Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Evaluate lease applications submitted by prospective tenants.
          </p>
        </div>
      </div>

      {/* Main requests management section */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">Applications Log</CardTitle>
          <CardDescription>
            Accepting an application changes its status to APPROVED, enabling
            the tenant to complete checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsClientTable initialRequests={requests} />
        </CardContent>
      </Card>
    </div>
  );
}
