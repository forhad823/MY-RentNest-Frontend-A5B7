// -------- Shared Route-Level Loading Skeletons --------
import { Skeleton } from "@/components/ui/skeleton";

/****
 * Skeleton fallbacks used by segment-level loading.tsx files.
 * These render instantly during client navigation while the
 * uncached server data streams in, so route changes never feel
 * like a dead click.
 ****/

// -------- Navbar Skeleton (session-aware header fallback) --------

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </header>
  );
}

// -------- Dashboard Skeleton (stats cards + table) --------

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="space-y-3 border-b pb-6">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border bg-card rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="border bg-card rounded-lg overflow-hidden">
        <div className="p-6 pb-3 space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="px-6 pb-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// -------- Property Catalog Grid Skeleton --------

export function PropertyGridSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="space-y-3 border-b pb-6">
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border bg-card rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------- Single Property Detail Skeleton --------

export function PropertyDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl space-y-8">
      {/* Gallery + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="aspect-4/3 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-11 w-44 rounded-md mt-4" />
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// -------- Generic Centered Pulse Fallback --------

export function SimpleLoaderSkeleton() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
