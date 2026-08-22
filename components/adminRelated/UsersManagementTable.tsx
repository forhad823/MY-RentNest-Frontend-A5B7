"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  CheckCircle2,
  Loader2,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { TAdminUser, updateUserStatus } from "@/service/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersManagementTableProps {
  initialUsers: TAdminUser[];
}

export default function UsersManagementTable({
  initialUsers,
}: UsersManagementTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState<TAdminUser[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // -------- Client-Side Search & Role Filtering --------
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;
      const matchesTerm =
        !term ||
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term);
      return matchesRole && matchesTerm;
    });
  }, [users, searchTerm, roleFilter]);

  // -------- Ban / Unban Status Toggle Handler --------
  const handleToggleStatus = async (user: TAdminUser) => {
    if (
      !confirm(
        `Are you sure you want to ${
          user.activeStatus === "ACTIVE" ? "ban (BLOCKED)" : "unban (ACTIVE)"
        } "${user.name}"?`,
      )
    ) {
      return;
    }

    const newStatus = user.activeStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setUpdatingId(user.id);
    try {
      const response = await updateUserStatus(user.id, {
        activeStatus: newStatus,
      });
      if (response.success) {
        toast.success(
          `${user.name} is now ${newStatus === "BLOCKED" ? "banned" : "active"}.`,
        );
        // Local UI update for instant feedback
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, activeStatus: newStatus } : u,
          ),
        );
        router.refresh();
      } else {
        throw new Error(response.message || "Failed to update user status.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("User status toggle error:", err);
      toast.error(err.message || "An error occurred while updating user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Role Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-9">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="TENANT">Tenants</SelectItem>
            <SelectItem value="LANDLORD">Landlords</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground sm:ml-auto">
          {filteredUsers.length} of {users.length} users
        </span>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        {filteredUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead className="text-right">Moderation Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const isBlocked = user.activeStatus === "BLOCKED";
                const isUpdating = updatingId === user.id;

                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* User Identity */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role Badge */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-semibold text-xs ${
                          user.role === "LANDLORD"
                            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
                            : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    {/* Active / Blocked Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1 font-semibold text-xs ${
                          isBlocked
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {isBlocked ? (
                          <ShieldAlert className="h-3 w-3" />
                        ) : (
                          <ShieldCheck className="h-3 w-3" />
                        )}
                        {isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>

                    {/* Ban / Unban Toggle */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingId !== null}
                        onClick={() => handleToggleStatus(user)}
                        className={
                          isBlocked
                            ? "h-8 gap-1.5 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/40 dark:hover:bg-emerald-950/20"
                            : "h-8 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/40 dark:hover:bg-rose-950/20"
                        }
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isBlocked ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Unban
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5" />
                            Ban User
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
              <User className="h-6 w-6 opacity-40" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No Users Found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No platform users match your current search or role filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
