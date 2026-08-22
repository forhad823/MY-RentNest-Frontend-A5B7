// -------- Landlord Property Listing Edit Page Component --------
import { redirect, notFound } from "next/navigation";
import { Edit3 } from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getPropertyById, getCategories } from "@/service/property";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropertyForm from "../../../../../../components/landlordRelated/PropertyForm";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Edit Property Listing | RentNest",
  description: "Modify an existing property listing on RentNest.",
};

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect(`/login?redirectTo=/dashboard/landlord`);
  }

  if (session.user.role !== "LANDLORD") {
    redirect("/");
  }

  const { id } = await params;

  // Fetch initial property details and categories list concurrently
  const [propertyRes, categoriesRes] = await Promise.all([
    getPropertyById(id),
    getCategories(),
  ]);

  const property = propertyRes.data;
  const categories = categoriesRes.data || [];

  if (!property) {
    notFound();
  }

  // Security: prevent landlords from editing listings owned by other landlords
  if (property.landlordId !== session.user.id) {
    redirect("/dashboard/landlord");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Edit3 className="h-8 w-8 text-primary" />
            Edit Property Listing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update listing configurations, price tags, or amenities for your
            property.
          </p>
        </div>

        <Card className="border shadow-md">
          <CardHeader className="pb-4 border-b bg-muted/10">
            <CardTitle className="text-lg font-bold">
              Listing Specifications
            </CardTitle>
            <CardDescription>
              Modify values and save updates. Changes reflect instantly in the
              catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <PropertyForm initialData={property} categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
