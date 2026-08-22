// -------- Single Property Detail Page Component --------
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Bed,
  Bath,
  MapPin,
  Tag,
  Star,
  User,
  Mail,
  ShieldCheck,
  CalendarCheck,
  ArrowLeft,
  Info,
  Layers,
  Sparkles,
  MessageSquare,
} from "lucide-react";

import { getPropertyById } from "@/service/property";
import { getServerSession } from "@/lib/auth-session";
import { PropertyImageGallery } from "@/components/shared/property-image-gallery";
import { RequestRentalModal } from "@/components/tenantRelated/RequestRentalModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const res = await getPropertyById(id);
  const property = res.data;

  if (!property) {
    return {
      title: "Property Not Found | RentNest",
    };
  }

  return {
    title: `${property.title} | RentNest`,
    description:
      property.description ||
      `Explore ${property.title} located at ${property.location}. Monthly rent: $${property.price}.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;

  const [propertyRes, session] = await Promise.all([
    getPropertyById(id),
    getServerSession(),
  ]);

  const property = propertyRes.data;

  if (!property) {
    notFound();
  }

  const currentUser = session.user;
  const isTenant = currentUser?.role === "TENANT";
  const isLandlord = currentUser?.role === "LANDLORD";
  const isAdmin = currentUser?.role === "ADMIN";
  const isOwner = currentUser?.id === property.landlordId;
  const isAvailable = property.availabilityStatus === "AVAILABLE";

  const reviews = property.reviews || [];
  const averageRating = property.averageRating ?? 0;
  const totalReviews = property.totalReviews ?? reviews.length;

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
      {/* Top Breadcrumb & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/properties">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </Button>

        {isOwner && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
              Edit Your Listing
            </Link>
          </Button>
        )}
      </div>

      {/* Main Title & Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={`text-xs uppercase tracking-wider font-semibold ${
                property.availabilityStatus === "AVAILABLE"
                  ? "bg-emerald-600 text-white"
                  : property.availabilityStatus === "RENTED"
                    ? "bg-rose-600 text-white"
                    : "bg-amber-600 text-white"
              }`}
            >
              {property.availabilityStatus}
            </Badge>

            {property.category && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Tag className="h-3 w-3" />
                {property.category.name}
              </Badge>
            )}

            {averageRating > 0 && (
              <Badge
                variant="outline"
                className="gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              >
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {averageRating} ({totalReviews}{" "}
                {totalReviews === 1 ? "review" : "reviews"})
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {property.title}
          </h1>

          <div className="flex items-center text-sm text-muted-foreground gap-1.5 pt-1">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="text-3xl md:text-4xl font-extrabold text-primary flex items-baseline">
            <span>${property.price}</span>
            <span className="text-sm font-normal text-muted-foreground ml-1.5">
              / month
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-0.5">
            Includes standard utilities
          </span>
        </div>
      </div>

      {/* Media & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Image Gallery, Specs, Description, Amenities, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Interactive Image Gallery */}
          <PropertyImageGallery
            images={property.images}
            title={property.title}
          />

          {/* Quick Specifications Bar */}
          <div className="grid grid-cols-3 gap-4 p-4 md:p-6 rounded-2xl bg-muted/30 border">
            <div className="flex flex-col items-center justify-center text-center p-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Bed className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground">
                {property.bedroomCount}
              </span>
              <span className="text-xs text-muted-foreground">Bedrooms</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-2 border-x">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Bath className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground">
                {property.bathroomCount}
              </span>
              <span className="text-xs text-muted-foreground">Bathrooms</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground truncate max-w-full">
                {property.category?.name || "Rental"}
              </span>
              <span className="text-xs text-muted-foreground">Type</span>
            </div>
          </div>

          {/* Property Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              About This Property
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm md:text-base">
              {property.description ? (
                <p className="whitespace-pre-line">{property.description}</p>
              ) : (
                <p className="italic text-muted-foreground">
                  No detailed description provided by the landlord.
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Offered Amenities & Features
            </h2>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl border bg-card text-card-foreground text-sm font-medium shadow-xs"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No specific amenities listed.
              </p>
            )}
          </div>

          <Separator />

          {/* Tenant Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Tenant Reviews ({totalReviews})
              </h2>

              {averageRating > 0 && (
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(averageRating)
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span>{averageRating.toFixed(1)} out of 5</span>
                </div>
              )}
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <Card key={rev.id} className="border bg-card/60 shadow-xs">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                              {rev.tenant?.name?.charAt(0).toUpperCase() || "T"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-sm font-bold">
                              {rev.tenant?.name || "Verified Tenant"}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {new Date(rev.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Star rating for review */}
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-foreground/90">
                        {rev.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-muted/20 border border-dashed">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground font-medium">
                  No tenant reviews yet for this listing.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tenants with completed rentals can leave feedback and ratings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Sticky CTA & Landlord Contact Card */}
        <div className="space-y-6">
          <div className="sticky top-20 space-y-6">
            {/* Booking / Request Action Card */}
            <Card className="border shadow-lg overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-2xl font-extrabold text-foreground">
                      ${property.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      / month
                    </span>
                  </div>
                  <Badge
                    className={`text-xs uppercase font-semibold ${
                      isAvailable
                        ? "bg-emerald-600 text-white"
                        : "bg-rose-600 text-white"
                    }`}
                  >
                    {property.availabilityStatus}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-muted-foreground">Rental Term</span>
                    <span className="font-semibold text-foreground">
                      Monthly Renewable
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-muted-foreground">Deposit</span>
                    <span className="font-semibold text-foreground">
                      $0 (No upfront deposit)
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-muted-foreground">
                      Bedrooms / Baths
                    </span>
                    <span className="font-semibold text-foreground">
                      {property.bedroomCount} Beds / {property.bathroomCount}{" "}
                      Baths
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">
                      Payment Protection
                    </span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Stripe Verified
                    </span>
                  </div>
                </div>

                {/* Dynamic Request to Rent CTA logic */}
                <div className="pt-2">
                  {!isAvailable ? (
                    <Button disabled className="w-full" size="lg">
                      Property Currently Unavailable
                    </Button>
                  ) : !session.isAuthenticated ? (
                    <Button
                      asChild
                      size="lg"
                      className="w-full font-semibold shadow-md"
                    >
                      <Link
                        href={`/login?redirectTo=/properties/${property.id}`}
                      >
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        Log in to Request Rental
                      </Link>
                    </Button>
                  ) : isLandlord || isAdmin ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                      <p className="font-semibold mb-1">
                        Landlord/Admin Account
                      </p>
                      <p>
                        You are signed in as a{" "}
                        {currentUser?.role?.toLowerCase()}. Rental applications
                        can only be submitted from a Tenant account.
                      </p>
                    </div>
                  ) : (
                    <RequestRentalModal property={property} />
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-muted/10 border-t pt-3 pb-3 text-center">
                <p className="text-[11px] text-muted-foreground mx-auto flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Free cancellation prior to landlord approval
                </p>
              </CardFooter>
            </Card>

            {/* Landlord Profile Card */}
            <Card className="border shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Listed by Landlord
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-base">
                      {property.landlord?.name?.charAt(0).toUpperCase() || "L"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5 overflow-hidden">
                    <h3 className="text-sm font-bold text-foreground truncate">
                      {property.landlord?.name || "Verified Landlord"}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      Platform Verified Host
                    </p>
                  </div>
                </div>

                {property.landlord?.email && (
                  <div className="p-3 rounded-xl bg-muted/40 border text-xs flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{property.landlord.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
