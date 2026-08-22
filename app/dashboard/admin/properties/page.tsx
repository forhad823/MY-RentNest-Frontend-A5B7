// -------- Admin Global Property Oversight Page --------
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Eye, MapPin, User } from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getAllProperties } from "@/service/admin";
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

export const metadata = {
  title: "All Properties | RentNest Admin",
  description: "Monitor every rental listing published on the platform.",
};

export default async function AdminPropertiesPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/admin/properties");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const propertiesRes = await getAllProperties();
  const properties = propertiesRes.data || [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          Admin Console
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
          Global Listing Oversight
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor all {properties.length} property listings across every
          landlord on the platform.
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">All Properties</CardTitle>
          <CardDescription>
            Read-only registry of every listing published on RentNest.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {properties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rent Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow
                    key={property.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Property Title */}
                    <TableCell className="font-semibold text-foreground max-w-65">
                      <Link
                        href={`/properties/${property.id}`}
                        className="hover:underline hover:text-primary transition-colors line-clamp-1"
                      >
                        {property.title}
                      </Link>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="text-muted-foreground text-xs max-w-45 truncate">
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

                    {/* Capacity */}
                    <TableCell className="text-xs text-muted-foreground">
                      {property.bedroomCount} Beds / {property.bathroomCount}{" "}
                      Baths
                    </TableCell>

                    {/* Availability Status */}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
                <Building2 className="h-6 w-6 opacity-40" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No Listings Found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No properties have been listed on the platform yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Landlord Attribution Note */}
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <User className="h-3.5 w-3.5" />
        Tip: open a property to inspect its landlord profile, reviews, and
        rental activity.
      </p>
    </div>
  );
}
