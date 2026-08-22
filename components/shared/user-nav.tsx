"use client";

// -------- Role-Aware User Navigation Dropdown Component --------
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Home,
  FileText,
  ShieldAlert,
  Building,
  Users,
} from "lucide-react";

import { TAuthUser } from "@/lib/auth-session";
import { logoutAction } from "@/app/(authGroup)/_actions/authAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserNavProps {
  user: TAuthUser;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await logoutAction();
      if (res.success) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      } else {
        toast.error(res.error || "Logout failed");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  const getDashboardPath = () => {
    switch (user.role) {
      case "TENANT":
        return "/dashboard/tenant";
      case "LANDLORD":
        return "/dashboard/landlord";
      case "ADMIN":
        return "/dashboard/admin";
      default:
        return "/";
    }
  };

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case "ADMIN":
        return "bg-amber-700 text-white hover:bg-destructive/500";
      case "LANDLORD":
        return "bg-violet-700 text-white hover:bg-amber-700 dark:bg-violet-600";
      case "TENANT":
      default:
        return "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-primary/10 border border-primary/20 p-0"
        >
          <UserIcon className="h-5 w-5 text-primary" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-white text-sm font-bold leading-none">
                {user.name || "User"}
              </p>
              <Badge className={getRoleBadgeColor()}>{user.role}</Badge>
            </div>
            <p className="text-white text-xs leading-none font-light truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Main Dashboard Link */}
          <DropdownMenuItem
            onClick={() => router.push(getDashboardPath())}
            className="cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4 text-white" />
            <span>Dashboard Overview</span>
          </DropdownMenuItem>

          {/* Role Specific Action Links */}
          {user.role === "TENANT" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/tenant")}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>My Rental Requests</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/tenant/reviews")}
                className="cursor-pointer"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>My Property Reviews</span>
              </DropdownMenuItem>
            </>
          )}

          {user.role === "LANDLORD" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/landlord")}
                className="cursor-pointer"
              >
                <Building className="mr-2 h-4 w-4" />
                <span>My Listings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push("/dashboard/landlord/properties/new")
                }
                className="cursor-pointer"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Post New Property</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/landlord/requests")}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Incoming Applications</span>
              </DropdownMenuItem>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/admin/users")}
                className="cursor-pointer"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>User Management</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/admin/properties")}
                className="cursor-pointer"
              >
                <Building className="mr-2 h-4 w-4" />
                <span>Listing Moderation</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/admin/rentals")}
                className="cursor-pointer"
              >
                <ShieldAlert className="mr-2 h-4 w-4" />
                <span>Rental Oversight</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4 font-extrabold" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
