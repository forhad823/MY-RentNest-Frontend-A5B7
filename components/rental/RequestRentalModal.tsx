"use client";

// -------- Request Rental Application Dialog Component --------
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { TProperty } from "@/lib/types";
import { submitRentalRequestAction } from "@/app/(publicGroup)/_actions/rentalAction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RequestRentalModalProps {
  property: TProperty;
  trigger?: React.ReactNode;
}

export function RequestRentalModal({
  property,
  trigger,
}: RequestRentalModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleRentalSubmit = async () => {
    startTransition(async () => {
      try {
        const res = await submitRentalRequestAction({
          propertyId: property.id,
          rentAmount: property.price,
        });

        if (res.success) {
          toast.success(res.message || "Rental request submitted successfully!", {
            description:
              "The landlord has been notified and will review your request.",
          });
          setIsSubmitted(true);
        } else {
          toast.error(res.error || res.message || "Failed to submit rental request");
        }
      } catch (err: unknown) {
        const error = err as Error;
        toast.error(
          error.message || "Something went wrong while submitting your request.",
        );
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    if (isSubmitted) {
      setIsSubmitted(false);
      router.refresh();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            size="lg"
            className="w-full text-base font-semibold shadow-md cursor-pointer"
          >
            <CalendarCheck className="mr-2 h-5 w-5" />
            Request to Rent
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-2xl font-bold">
                Application Submitted!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-2">
                Your rental request for{" "}
                <span className="font-semibold text-foreground">
                  {property.title}
                </span>{" "}
                has been recorded with status{" "}
                <span className="text-amber-600 font-semibold uppercase text-xs">
                  PENDING
                </span>
                . You can monitor approval from your tenant dashboard.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-xl bg-muted/50 border text-left space-y-2 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rent:</span>
                <span className="font-bold text-foreground">
                  ${property.price}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium text-foreground truncate max-w-[200px]">
                  {property.location}
                </span>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/tenant");
                }}
              >
                Go to Tenant Dashboard
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Submit Rental Request
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Confirm your rental application details below before submitting to
                the landlord.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Property Summary Box */}
              <div className="p-4 rounded-xl bg-muted/40 border space-y-2">
                <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                  {property.title}
                </h4>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t mt-2">
                  <span className="text-xs text-muted-foreground">
                    Monthly Rent
                  </span>
                  <span className="text-lg font-extrabold text-primary flex items-center">
                    <DollarSign className="h-4 w-4" />
                    {property.price}
                    <span className="text-xs font-normal text-muted-foreground">
                      /month
                    </span>
                  </span>
                </div>
              </div>

              {/* Application Terms & Notes */}
              <div className="space-y-2.5 text-xs text-muted-foreground bg-primary/5 p-3.5 rounded-lg border border-primary/15">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p>
                    Once approved by the landlord, you will be invited to
                    complete the secure rental payment via Stripe.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p>
                    Your request will remain in <strong>Pending</strong> status
                    until reviewed.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRentalSubmit}
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="h-4 w-4" />
                    Confirm & Send Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
