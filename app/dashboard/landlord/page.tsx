// -------- Landlord Dashboard Overview Page --------
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Plus,
  Edit3,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  PlusCircle,
} from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import {
  getLandlordProperties,
  getLandlordRentalRequests,
} from "@/service/landlord";
import { Button } from "@/components/ui/button";
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
import DeletePropertyButton from "../../../components/landlordRelated/DeletePropertyButton";

export const metadata = {
  title: "Landlord Dashboard | RentNest",
  description:
    "Manage your rental property listings and incoming lease applications.",
};

export default async function LandlordDashboardPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/landlord");
  }

  if (session.user.role !== "LANDLORD") {
    redirect("/");
  }

  // Fetch properties and requests concurrently
  const [propertiesRes, requestsRes] = await Promise.all([
    getLandlordProperties(),
    getLandlordRentalRequests(),
  ]);

  const properties = propertiesRes.data || [];
  const requests = requestsRes.data || [];

  // Metrics calculations
  const totalProperties = properties.length;
  const activeRentals = properties.filter(
    (p) => p.availabilityStatus === "RENTED",
  ).length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            Landlord Console
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
            Welcome, {session.user.name || "Landlord"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage listings, track rental states, and review incoming
            applications.
          </p>
        </div>

        <div className="flex gap-2.5 self-start sm:self-auto">
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/dashboard/landlord/requests">
              <FileText className="h-4 w-4" />
              Incoming Requests
              {pendingRequests > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 px-1.5 py-0.5 text-[10px]"
                >
                  {pendingRequests} new
                </Badge>
              )}
            </Link>
          </Button>

          <Button asChild className="gap-1.5 shadow-sm">
            <Link href="/dashboard/landlord/properties/new">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Listed Properties */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BuildingIcon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active catalog listings
            </p>
          </CardContent>
        </Card>

        {/* Active Leases / Rentals */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Rentals
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{activeRentals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Properties currently leased
            </p>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Applications needing decision
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties List Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">
            Your Listed Properties
          </CardTitle>
          <CardDescription>
            Modify, delete, or review statistics for each of your properties.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {properties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-75">Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rent Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => {
                  return (
                    <TableRow
                      key={property.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Property Detail */}
                      <TableCell className="font-semibold text-foreground">
                        <div className="flex flex-col">
                          <Link
                            href={`/properties/${property.id}`}
                            className="hover:underline hover:text-primary transition-colors line-clamp-1"
                          >
                            {property.title}
                          </Link>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ID: {property.id.slice(0, 8)}...
                          </span>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="text-muted-foreground text-xs max-w-50 truncate">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          {property.location}
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="font-bold text-primary">
                        ${property.price}
                        <span className="text-xs font-normal text-muted-foreground">
                          /mo
                        </span>
                      </TableCell>

                      {/* Capacity / Spec */}
                      <TableCell className="text-xs text-muted-foreground">
                        {property.bedroomCount} Beds / {property.bathroomCount}{" "}
                        Baths
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-semibold ${
                            property.availabilityStatus === "AVAILABLE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : property.availabilityStatus === "RENTED"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {property.availabilityStatus}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground"
                          >
                            <Link href={`/properties/${property.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:text-primary-700"
                          >
                            <Link
                              href={`/dashboard/landlord/properties/${property.id}/edit`}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeletePropertyButton propertyId={property.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
                <BuildingIcon className="h-6 w-6 opacity-40" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No Listings Yet
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                You haven&apos;t added any rental property listings to the
                platform yet. Get started by adding one.
              </p>
              <Button asChild size="sm" className="mt-4 gap-1.5">
                <Link href="/dashboard/landlord/properties/new">
                  <Plus className="h-4 w-4" />
                  Add Your First Property
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Small inline Helper icon
function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="16" />
      <line x1="15" y1="22" x2="15" y2="16" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <path d="M9 6h6" />
      <path d="M9 10h6" />
    </svg>
  );
}
