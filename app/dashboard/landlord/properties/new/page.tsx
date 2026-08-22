// -------- Landlord Property Creation Page Component --------
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { getServerSession } from "@/lib/auth-session";
import { getCategories } from "@/service/property";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropertyForm from "../../../../../components/landlordRelated/PropertyForm";

export const metadata = {
  title: "Add Property Listing | RentNest",
  description: "Create a new property listing on RentNest.",
};

export default async function NewPropertyPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.user) {
    redirect("/login?redirectTo=/dashboard/landlord/properties/new");
  }

  if (session.user.role !== "LANDLORD") {
    redirect("/");
  }

  // Fetch categories to populate dropdown selection
  const categoriesRes = await getCategories();
  const categories = categoriesRes.data || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <PlusCircle className="h-8 w-8 text-primary" />
            Add New Property
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provide the required details below to post your property onto the
            RentNest catalog.
          </p>
        </div>

        <Card className="border shadow-md">
          <CardHeader className="pb-4 border-b bg-muted/10">
            <CardTitle className="text-lg font-bold">
              Property Information
            </CardTitle>
            <CardDescription>
              Submit pricing, location specifications, amenities, and photos
              (optional).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <PropertyForm categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
