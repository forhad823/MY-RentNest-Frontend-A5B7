// -------- Public Landing Page Entry Component --------
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Home,
  MapPin,
  Bed,
  Bath,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

import { getCategories, getProperties } from "@/service/property";
import { HeroSearchForm } from "@/components/shared/hero-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const instant = false;

export const metadata = {
  title: "RentNest | Find & Rent Modern Homes & Apartments",
  description:
    "RentNest connects tenants with premium verified rental properties and landlords seamlessly.",
};

export default async function LandingPage() {
  const [categoriesRes, propertiesRes] = await Promise.all([
    getCategories(),
    getProperties({ limit: 6 }),
  ]);

  const categories = categoriesRes.data || [];
  const featuredProperties = propertiesRes.data || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* -------- Hero Section -------- */}
      <section className="relative py-20 lg:py-32 bg-linear-to-b from-muted/50 via-background to-background overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 border-primary/30 text-primary bg-primary/5 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> Premium Property Marketplace
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-foreground mb-6">
            Find Your Dream <span className="text-primary">Rental Home</span>{" "}
            With Total Confidence
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Discover verified apartments, luxury villas, and cozy homes.
            Seamless online rental applications, secure payments, and verified
            landlords.
          </p>

          {/* Hero Search Box */}
          <HeroSearchForm />

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 mt-16 pt-8 border-t border-border/60 w-full max-w-3xl text-center">
            <div>
              <p className="text-3xl font-bold text-primary">1,000+</p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">99%</p>
              <p className="text-sm text-muted-foreground">
                Verified Landlords
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Instant Booking</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------- Category Selector Grid -------- */}
      <section className="py-16 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Browse Property Categories
              </h2>
              <p className="text-muted-foreground mt-2">
                Filter homes by your preferred style and accommodation type
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="mt-4 md:mt-0 text-primary hover:text-primary/90 font-medium"
            >
              <Link href="/properties">
                Explore All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.id || `cat-${index}`}
                  href={`/properties?categoryId=${category.id}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {category.description ||
                          `Find verified ${category.name.toLowerCase()} rentals available now.`}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No categories available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* -------- Featured Rental Properties List -------- */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Featured Rental Properties
              </h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked top rated homes available for immediate lease
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/properties">
                View All{" "}
                {propertiesRes.meta?.total
                  ? `(${propertiesRes.meta.total})`
                  : ""}{" "}
                Properties
              </Link>
            </Button>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <Card
                  key={property.id || `prop-${index}`}
                  className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl border"
                >
                  {/* Property Image Thumbnail */}
                  <div className="relative h-56 w-full bg-muted overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <Image
                        src="https://i.postimg.cc/6Q0BQyCS/house-image-1.jpg"
                        alt={property.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      // <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted">
                      //   <Home className="h-10 w-10 mb-2 opacity-40" />
                      //   <span className="text-xs">No image uploaded</span>
                      // </div>
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
                    <CardTitle className="text-lg font-bold line-clamp-1">
                      {property.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* Specs Badges */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-primary" />
                        <span>{property.bedroomCount} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-primary" />
                        <span>{property.bathroomCount} Baths</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="flex items-baseline justify-between pt-2">
                      <div>
                        <span className="text-2xl font-extrabold text-primary">
                          ${property.price}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          / month
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-6 px-6">
                    <Button asChild className="w-full font-medium">
                      <Link href={`/properties/${property.id}`}>
                        View Details & Apply
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-2xl bg-muted/10">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium text-foreground">
                No properties found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back later or explore our categories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* -------- Call to Action Section -------- */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl">
          <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 px-4 py-1 text-xs">
            Get Started Today
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            Ready to Find Your Next Home or List Your Property?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of happy tenants and property owners on RentNest
            today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-semibold text-primary px-8"
            >
              <Link href="/register">Register as Tenant</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-semibold text-primary px-8"
            >
              <Link href="/register">List Your Property (Landlord)</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
