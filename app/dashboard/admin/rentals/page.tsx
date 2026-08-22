// -------- Admin Global Rental Request Oversight Page --------
import { redirect } from "next/navigation";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  User,
} from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getAllRentals } from "@/service/admin";
import type { RentalRequestStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "All Rental Requests | RentNest Admin",
  description:
    "Oversee every rental request exchanged between tenants and landlords.",
};

/***** Helper to render color-coded status badges for rental requests ****/
function RequestStatusBadge({ status }: { status: RentalRequestStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 font-semibold"
        >
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1 font-semibold"
        >
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </Badge>
      );
    case "ACTIVE":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 font-semibold"
        >
          <ShieldCheck className="h-3 w-3" />
          Active Lease
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 font-semibold"
        >
          <AlertCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default async function AdminRentalsPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/admin/rentals");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const rentalsRes = await getAllRentals();
  const rentals = rentalsRes.data || [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          Admin Console
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
          Global Request Oversight
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Audit all {rentals.length} rental requests across every tenant and
          landlord.
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">
            All Rental Requests
          </CardTitle>
          <CardDescription>
            Read-only audit trail. Status decisions are made by landlords.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {rentals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Landlord</TableHead>
                  <TableHead>Rent Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((request) => (
                  <TableRow
                    key={request.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Tenant */}
                    <TableCell>
                      <div className="flex items-center gap-2.5 min-w-[140px]">
                        <div className="h-8 w-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {request.tenant?.name || "Unknown Tenant"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Property */}
                    <TableCell className="max-w-[220px]">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 shrink-0 text-muted-foreground opacity-60" />
                        <span className="text-sm font-medium truncate">
                          {request.property?.title ||
                            `ID: ${request.propertyId.slice(0, 8)}...`}
                        </span>
                      </div>
                    </TableCell>

                    {/* Landlord */}
                    <TableCell className="text-sm text-muted-foreground">
                      {request.property?.landlord?.name || "—"}
                    </TableCell>

                    {/* Rent Amount */}
                    <TableCell className="font-bold text-primary text-sm">
                      ${request.rentAmount}
                      <span className="text-[11px] font-normal text-muted-foreground">
                        /mo
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <RequestStatusBadge status={request.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
                <FileText className="h-6 w-6 opacity-40" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No Requests Found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No rental requests have been submitted on the platform yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
