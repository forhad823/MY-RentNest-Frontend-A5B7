// -------- Shared Badge Style Lookups --------
// Single source of truth for status badge colors so every page renders
// statuses identically without repeating long class-name ternaries.
import {
  PaymentStatus,
  PropertyAvailability,
  RentalRequestStatus,
} from "./types";

export type AvailabilityBadgeVariant = "solid" | "soft";

// Solid = filled badges on public property cards.
// Soft  = tinted outline badges inside dashboard tables.
const AVAILABILITY_BADGE_CLASSES: Record<
  PropertyAvailability,
  Record<AvailabilityBadgeVariant, string>
> = {
  AVAILABLE: {
    solid: "bg-emerald-600 text-white",
    soft: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  RENTED: {
    solid: "bg-rose-600 text-white",
    soft: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  MAINTENANCE: {
    solid: "bg-amber-600 text-white",
    soft: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
};

const RENTAL_REQUEST_BADGE_CLASSES: Record<RentalRequestStatus, string> = {
  PENDING:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  APPROVED:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  ACTIVE:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  REJECTED:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

const PAYMENT_BADGE_CLASSES: Record<PaymentStatus, string> = {
  PENDING:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  COMPLETED:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  FAILED:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

export function getAvailabilityBadgeClass(
  status: PropertyAvailability,
  variant: AvailabilityBadgeVariant = "solid",
): string {
  return AVAILABILITY_BADGE_CLASSES[status][variant];
}

export function getRentalRequestBadgeClass(status: RentalRequestStatus): string {
  return RENTAL_REQUEST_BADGE_CLASSES[status];
}

export function getPaymentBadgeClass(status: PaymentStatus): string {
  return PAYMENT_BADGE_CLASSES[status];
}
