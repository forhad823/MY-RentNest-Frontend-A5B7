"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, User, Building, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { TRentalRequest } from "@/lib/types";
import { updateRentalRequestStatus } from "@/service/landlord";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RequestsClientTableProps {
  initialRequests: TRentalRequest[];
}

export default function RequestsClientTable({ initialRequests }: RequestsClientTableProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<TRentalRequest[]>(initialRequests);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (requestId: string, newStatus: "APPROVED" | "REJECTED") => {
    setUpdatingId(requestId);
    try {
      const response = await updateRentalRequestStatus(requestId, { status: newStatus });
      if (response.success) {
        toast.success(`Rental request ${newStatus.toLowerCase()} successfully.`);
        // Optimistic / Local UI update
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: newStatus }
              : req
          )
        );
        router.refresh();
      } else {
        throw new Error(response.message || "Failed to update request status.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Status update error:", err);
      toast.error(err.message || "An error occurred during update.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {requests.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Tenant Details</TableHead>
              <TableHead>Property Title</TableHead>
              <TableHead>Proposed Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const isPending = request.status === "PENDING";
              const tenantName = request.tenant?.name || "Anonymous Tenant";
              const tenantEmail = request.tenant?.email || "No email specified";
              const propTitle = request.property?.title || `ID: ${request.propertyId.slice(0, 8)}...`;

              return (
                <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                  {/* Tenant */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{tenantName}</p>
                        <p className="text-xs text-muted-foreground truncate">{tenantEmail}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Property */}
                  <TableCell className="max-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 shrink-0 text-muted-foreground opacity-60" />
                      <span className="text-sm font-medium text-foreground truncate">{propTitle}</span>
                    </div>
                  </TableCell>

                  {/* Rent Price */}
                  <TableCell className="font-bold text-primary text-sm">
                    ${request.rentAmount}
                    <span className="text-[11px] font-normal text-muted-foreground">/mo</span>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-semibold text-xs ${
                        request.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : request.status === "APPROVED"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                          : request.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {request.status === "PENDING"
                        ? "Pending Approval"
                        : request.status === "APPROVED"
                        ? "Approved"
                        : request.status === "ACTIVE"
                        ? "Active Lease"
                        : "Rejected"}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isPending ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/30 dark:hover:bg-rose-950/20"
                            onClick={() => handleStatusUpdate(request.id, "REJECTED")}
                            disabled={updatingId !== null}
                          >
                            {updatingId === request.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <X className="mr-1 h-3.5 w-3.5" />
                                Reject
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                            onClick={() => handleStatusUpdate(request.id, "APPROVED")}
                            disabled={updatingId !== null}
                          >
                            {updatingId === request.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <Check className="mr-1 h-3.5 w-3.5" />
                                Approve
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic mr-2">
                          Decision made
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-16 px-4">
          <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3">
            <AlertCircle className="h-6 w-6 opacity-40" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Requests Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            You don&apos;t have any incoming rental applications for your properties at this time.
          </p>
        </div>
      )}
    </div>
  );
}
