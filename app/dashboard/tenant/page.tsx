// -------- Tenant Dashboard & Rental Request Management Page --------
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Home,
  MessageSquare,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getRentalRequests } from "@/service/rental";
import { getPayments } from "@/service/payment";
import { getPropertyById } from "@/service/property";
import { TRentalRequest, TPayment, RentalRequestStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Tenant Dashboard | RentNest",
  description: "View your rental requests, active leases, and payment history.",
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
          Pending Approval
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1 font-semibold"
        >
          <CheckCircle2 className="h-3 w-3" />
          Approved & Ready to Pay
        </Badge>
      );
    case "ACTIVE":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 font-semibold"
        >
          <ShieldCheck className="h-3 w-3" />
          Active Rental
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 font-semibold"
        >
          <XCircle className="h-3 w-3" />
          Declined
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

/***** Helper to render payment status badges****/
function PaymentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold"
        >
          Completed
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
        >
          Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-semibold"
        >
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

//---------------- Tenant Dashboard Page Component ----------------
export default async function TenantDashboardPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/tenant");
  }

  if (session.user.role !== "TENANT") {
    redirect("/");
  }

  // Fetch rental requests and payments concurrently
  const [requestsRes, paymentsRes] = await Promise.all([
    getRentalRequests(),
    getPayments(),
  ]);

  const rawRequests = requestsRes.data || [];
  const payments: TPayment[] = paymentsRes.data || [];

  // Hydrate property details for requests that lack embedded property data
  const requests: TRentalRequest[] = await Promise.all(
    rawRequests.map(async (req) => {
      if (req.property) return req;
      try {
        const propRes = await getPropertyById(req.propertyId);
        return {
          ...req,
          property: propRes.data || undefined,
        };
      } catch {
        return req;
      }
    }),
  );

  // Compute platform metrics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter(
    (r) => r.status === "APPROVED",
  ).length;
  const activeRentals = requests.filter((r) => r.status === "ACTIVE").length;
  const totalPaid = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              Tenant Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {session.user.name || "Tenant"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your rental applications, manage approved leases, and review
            payment receipts.
          </p>
        </div>

        <Button asChild className="gap-2 shadow-xs self-start md:self-auto">
          <Link href="/properties">
            <Home className="h-4 w-4" />
            Browse More Properties
          </Link>
        </Button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {totalRequests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Submitted across platform
            </p>
          </CardContent>
        </Card>

        {/* Pending Review */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting landlord decision
            </p>
          </CardContent>
        </Card>

        {/* Approved / Ready to Pay */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Leases
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {approvedRequests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {approvedRequests > 0
                ? "Action required: Pay to activate"
                : "None awaiting payment"}
            </p>
          </CardContent>
        </Card>

        {/* Active Rentals */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Rentals
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Building className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {activeRentals}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently leased properties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs: Rental Requests & Payment History */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full sm:w-80 grid-cols-2">
          <TabsTrigger value="requests" className="gap-2">
            <FileText className="h-4 w-4" />
            Rental Requests ({totalRequests})
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payments ({payments.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Rental Requests Table */}
        <TabsContent value="requests" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">
                Rental Applications History
              </CardTitle>
              <CardDescription>
                All rental requests submitted with status tracking and checkout
                triggers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {requests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-[300px]">Property</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Monthly Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => {
                      const property = request.property;
                      const title =
                        property?.title ||
                        `Property ID: ${request.propertyId.slice(0, 8)}...`;
                      const location = property?.location || "—";
                      const dateApplied = new Date(
                        request.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <TableRow
                          key={request.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          {/* Property Title */}
                          <TableCell className="font-semibold text-foreground">
                            <div className="flex flex-col">
                              <Link
                                href={`/properties/${request.propertyId}`}
                                className="hover:underline hover:text-primary transition-colors line-clamp-1 flex items-center gap-1.5"
                              >
                                {title}
                                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-60 shrink-0" />
                              </Link>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                Req #{request.id.slice(0, 8)}
                              </span>
                            </div>
                          </TableCell>

                          {/* Location */}
                          <TableCell className="text-muted-foreground text-xs max-w-[180px] truncate">
                            {location}
                          </TableCell>

                          {/* Rent Amount */}
                          <TableCell className="font-bold text-primary">
                            ${request.rentAmount}
                            <span className="text-xs font-normal text-muted-foreground">
                              /mo
                            </span>
                          </TableCell>

                          {/* Status Badge */}
                          <TableCell>
                            <RequestStatusBadge status={request.status} />
                          </TableCell>

                          {/* Date Applied */}
                          <TableCell className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 opacity-60" />
                              {dateApplied}
                            </div>
                          </TableCell>

                          {/* Action Buttons */}
                          <TableCell className="text-right">
                            {request.status === "APPROVED" && (
                              <Button
                                asChild
                                size="sm"
                                className="bg-primary text-primary-foreground font-semibold shadow-xs gap-1.5"
                              >
                                <Link
                                  href={`/dashboard/tenant/requests/${request.id}/pay`}
                                >
                                  <CreditCard className="h-3.5 w-3.5" />
                                  Pay Now
                                </Link>
                              </Button>
                            )}

                            {request.status === "ACTIVE" && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-primary/30 text-primary hover:bg-primary/10 gap-1.5 font-medium"
                              >
                                <Link
                                  href={`/dashboard/tenant/reviews?propertyId=${request.propertyId}&requestId=${request.id}`}
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  Leave Review
                                </Link>
                              </Button>
                            )}

                            {request.status === "PENDING" && (
                              <span className="text-xs text-muted-foreground italic">
                                Awaiting response
                              </span>
                            )}

                            {request.status === "REJECTED" && (
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                              >
                                <Link href="/properties">Browse Others</Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
                    <FileText className="h-6 w-6 opacity-40" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    No Rental Requests Yet
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    You haven&apos;t applied for any rental properties yet.
                    Browse our catalog and apply in seconds.
                  </p>
                  <Button asChild size="sm" className="mt-4 gap-1.5">
                    <Link href="/properties">
                      <Home className="h-4 w-4" />
                      Browse Properties Catalog
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Payment History Table */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  Payment Transactions
                </CardTitle>
                <CardDescription>
                  Receipts and records for completed rental transactions via
                  Stripe.
                </CardDescription>
              </div>
              {totalPaid > 0 && (
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    Total Settled
                  </span>
                  <div className="text-lg font-bold text-emerald-600">
                    ${totalPaid.toFixed(2)}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => {
                      const propTitle =
                        payment.rentalRequest?.property?.title ||
                        "Rental Lease";
                      const date = new Date(
                        payment.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <TableRow
                          key={payment.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            #{payment.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="font-medium text-foreground text-sm max-w-[220px] truncate">
                            {propTitle}
                          </TableCell>
                          <TableCell className="font-bold text-foreground">
                            ${payment.amount}{" "}
                            <span className="text-xs text-muted-foreground uppercase">
                              {payment.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            <PaymentStatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground capitalize">
                            {payment.paymentMethod || "Card (Stripe)"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {date}
                          </TableCell>
                          <TableCell className="text-right">
                            {payment.stripeReceiptUrl ? (
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs text-primary"
                              >
                                <a
                                  href={payment.stripeReceiptUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View Receipt
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Verified
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
                    <CreditCard className="h-6 w-6 opacity-40" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    No Payments Recorded
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Once a landlord approves your application, you can complete
                    payment through Stripe here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
