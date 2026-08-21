// -------- Property Catalog Page Component --------
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bed,
  Bath,
  MapPin,
  Home,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

import { getCategories, getProperties } from "@/service/property";
import { PropertyFilterSidebar } from "@/components/shared/property-filter-sidebar";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const instant = false;

export const metadata = {
  title: "Browse Properties | RentNest",
  description:
    "Explore all available rental properties, apartments, and villas.",
};

interface PropertiesPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    location?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    bedroomCount?: string;
    bathroomCount?: string;
    amenities?: string | string[];
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const resolvedSearchParams = await searchParams;

  // Format array parameters
  let amenities: string[] | undefined;
  if (resolvedSearchParams.amenities) {
    amenities = Array.isArray(resolvedSearchParams.amenities)
      ? resolvedSearchParams.amenities
      : [resolvedSearchParams.amenities];
  }

  const queryFilters = {
    searchTerm: resolvedSearchParams.searchTerm,
    location: resolvedSearchParams.location,
    categoryId: resolvedSearchParams.categoryId,
    minPrice: resolvedSearchParams.minPrice
      ? Number(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams.maxPrice
      ? Number(resolvedSearchParams.maxPrice)
      : undefined,
    bedroomCount: resolvedSearchParams.bedroomCount
      ? Number(resolvedSearchParams.bedroomCount)
      : undefined,
    bathroomCount: resolvedSearchParams.bathroomCount
      ? Number(resolvedSearchParams.bathroomCount)
      : undefined,
    amenities,
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    limit: resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : 9,
    sortBy: resolvedSearchParams.sortBy || "createdAt",
    sortOrder: resolvedSearchParams.sortOrder || "desc",
  };

  const [categoriesRes, propertiesRes] = await Promise.all([
    getCategories(),
    getProperties(queryFilters),
  ]);

  const categories = categoriesRes.data || [];
  // ---------------?? -----
  // console.log("Categories in PropertiesPage:", categories);
  //[ { name: 'apartment' }, { name: 'house' }, { name: 'studio' } ]
  const properties = propertiesRes.data || [];
  const meta = propertiesRes.meta || {
    page: queryFilters.page,
    limit: queryFilters.limit,
    total: properties.length,
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Available Rental Properties
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse through {meta.total} verified apartments, houses, and rooms
          </p>
        </div>

        {/* Mobile Filter Sheet Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter Catalog
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle>Filter Properties</SheetTitle>
              </SheetHeader>
              <Suspense
                fallback={
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                }
              >
                <PropertyFilterSidebar categories={categories} />
              </Suspense>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-20">
            <Suspense
              fallback={
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              }
            >
              <PropertyFilterSidebar categories={categories} />
            </Suspense>
          </div>
        </aside>

        {/* Main Property Cards Grid */}
        <main className="md:col-span-3 flex flex-col">
          {properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                {properties.map((property, index) => (
                  <Card
                    key={property.id || `property-${index}`}
                    className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl border"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted">
                          <Home className="h-8 w-8 mb-1 opacity-40" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                      <Badge
                        className={`absolute top-3 right-3 text-xs uppercase tracking-wider font-semibold ${
                          property.availabilityStatus === "AVAILABLE"
                            ? "bg-emerald-600 text-white"
                            : property.availabilityStatus === "RENTED"
                              ? "bg-rose-600 text-white"
                              : "bg-amber-600 text-white"
                        }`}
                      >
                        {property.availabilityStatus}
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-center text-xs text-muted-foreground mb-1 gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                      <CardTitle className="text-base font-bold line-clamp-1">
                        {property.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t">
                        <div className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5 text-primary" />
                          <span>{property.bedroomCount} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5 text-primary" />
                          <span>{property.bathroomCount} Baths</span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      {property.amenities && property.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {property.amenities
                            .slice(0, 3)
                            .map((amenity, aIdx) => (
                              <Badge
                                key={aIdx}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          {property.amenities.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              +{property.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="pt-2">
                        <span className="text-xl font-extrabold text-primary">
                          ${property.price}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          / month
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 pb-5 px-6">
                      <Button asChild size="sm" className="w-full font-medium">
                        <Link href={`/properties/${property.id}`}>
                          View Details & Apply
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination — also needs Suspense because it uses useSearchParams() */}
              <Suspense fallback={null}>
                <PaginationControls
                  currentPage={meta.page}
                  limit={meta.limit}
                  total={meta.total}
                />
              </Suspense>
            </>
          ) : (
            <div className="text-center py-20 border rounded-2xl bg-muted/10 my-auto">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-lg font-bold text-foreground">
                No properties match your filters
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to see
                more results.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
