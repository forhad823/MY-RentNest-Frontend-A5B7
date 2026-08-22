// -------- Tenant Review Submission Page Component --------
import { redirect, notFound } from "next/navigation";
import { MessageSquare, MapPin, Building, } from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getPropertyById } from "@/service/property";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReviewForm from "@/components/tenantRelated/ReviewForm";

interface ReviewPageProps {
  searchParams: Promise<{
    propertyId?: string;
    requestId?: string;
  }>;
}

export const metadata = {
  title: "Submit Review | RentNest",
  description:
    "Share your rental experience and submit rating for the property.",
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/tenant");
  }

  if (session.user.role !== "TENANT") {
    redirect("/");
  }

  const { propertyId } = await searchParams;

  if (!propertyId) {
    notFound();
  }

  const propertyRes = await getPropertyById(propertyId);
  const property = propertyRes.data;

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <MessageSquare className="h-8 w-8 text-primary" />
            Write a Review
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Your feedback helps other tenants make informed decisions.
          </p>
        </div>

        {/* Property Reference Card */}
        <Card className="border shadow-xs bg-muted/20">
          <CardContent className="p-4 flex gap-4 items-start">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Building className="h-7 w-7" />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-base font-bold text-foreground truncate">
                {property.title}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {property.location}
              </p>
              {property.category && (
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-semibold"
                >
                  {property.category.name}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review Form Card */}
        <Card className="border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Review Details</CardTitle>
            <CardDescription>
              Provide rating and comment for your stay at this property.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ReviewForm propertyId={property.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
