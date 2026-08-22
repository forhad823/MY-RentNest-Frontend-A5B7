// -------- Admin Moderation Dashboard Page --------
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Ban,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  ShieldAlert,
  Users,
  UserCog,
} from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getAllProperties, getAllRentals, getAllUsers } from "@/service/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Admin Dashboard | RentNest",
  description:
    "Platform health overview, user moderation, and global listing oversight.",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch users, properties, and rental requests concurrently
  const [usersRes, propertiesRes, rentalsRes] = await Promise.all([
    getAllUsers(),
    getAllProperties(),
    getAllRentals(),
  ]);

  const users = usersRes.data || [];
  const properties = propertiesRes.data || [];
  const rentals = rentalsRes.data || [];

  // -------- Platform Statistics Calculations --------
  const totalTenants = users.filter((u) => u.role === "TENANT").length;
  const totalLandlords = users.filter((u) => u.role === "LANDLORD").length;
  const blockedUsers = users.filter((u) => u.activeStatus === "BLOCKED").length;

  const availableProperties = properties.filter(
    (p) => p.availabilityStatus === "AVAILABLE",
  ).length;
  const rentedProperties = properties.filter(
    (p) => p.availabilityStatus === "RENTED",
  ).length;

  const pendingRequests = rentals.filter((r) => r.status === "PENDING").length;
  const activeRequests = rentals.filter((r) => r.status === "ACTIVE").length;

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            Admin Console
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
            Welcome, {session.user.name || "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor platform health, moderate user accounts, and oversee all
            listings and rental activity.
          </p>
        </div>

        <div className="flex gap-2.5 self-start sm:self-auto">
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/dashboard/admin/properties">
              <Building2 className="h-4 w-4" />
              All Properties
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/dashboard/admin/rentals">
              <FileText className="h-4 w-4" />
              All Requests
              {pendingRequests > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 px-1.5 py-0.5 text-[10px]"
                >
                  {pendingRequests} pending
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Platform Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalTenants} tenants · {totalLandlords} landlords
            </p>
          </CardContent>
        </Card>

        {/* Blocked Accounts */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Blocked Accounts
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Ban className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{blockedUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Banned from the platform
            </p>
          </CardContent>
        </Card>

        {/* Total Properties */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Listed Properties
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{properties.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {availableProperties} available · {rentedProperties} rented
            </p>
          </CardContent>
        </Card>

        {/* Rental Requests */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rental Requests
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{rentals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingRequests} pending · {activeRequests} active leases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Moderation Management Quick Links */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col items-center text-center">
            <CardTitle className="text-lg font-bold flex items-center justify-center gap-2">
              <UserCog className="h-4.5 w-4.5 text-primary" />
              User Account Moderation
              {blockedUsers > 0 && (
                <Badge
                  variant="outline"
                  className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-semibold"
                >
                  <ShieldAlert className="h-3 w-3" />
                  {blockedUsers} blocked
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Review all tenants and landlords. Ban abusive accounts or restore
              access at any time.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <Link href="/dashboard/admin/users">
              Manage and moderate all {users.length} users
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Global Oversight Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Oversight Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-primary" />
              Listing Oversight
            </CardTitle>
            <CardDescription>
              Inspect every property listed on the platform across all
              landlords.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
              <Link href="/dashboard/admin/properties">
                View all {properties.length} listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Rental Oversight Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary" />
              Request Oversight
            </CardTitle>
            <CardDescription>
              Audit every rental request exchanged between tenants and
              landlords.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
              <Link href="/dashboard/admin/rentals">
                View all {rentals.length} requests
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
