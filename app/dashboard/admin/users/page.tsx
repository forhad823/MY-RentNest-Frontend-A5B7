// -------- Admin Platform User Management Page --------
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth-session";
import { getAllUsers } from "@/service/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsersManagementTable from "../../../../components/adminRelated/UsersManagementTable";

export const metadata = {
  title: "User Management | RentNest Admin",
  description: "Ban or unban tenant and landlord accounts across the platform.",
};

export default async function AdminUsersPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/admin/users");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const usersRes = await getAllUsers();
  const users = usersRes.data || [];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          Admin Console
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All tenants and landlords registered on RentNest. Ban abusive
          accounts or restore access.
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">
            Registered Accounts ({users.length})
          </CardTitle>
          <CardDescription>
            Status changes take effect immediately across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <UsersManagementTable initialUsers={users} />
        </CardContent>
      </Card>
    </div>
  );
}
