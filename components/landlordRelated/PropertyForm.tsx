"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TProperty, TCategory, PropertyAvailability } from "@/lib/types";
import {
  createProperty,
  updateProperty,
  IPropertyPayload,
} from "@/service/landlord";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PropertyFormProps {
  initialData?: TProperty | null;
  categories: TCategory[];
}

const AMENITY_OPTIONS = [
  "WiFi",
  "Air Conditioning",
  "Parking",
  "Kitchen",
  "Gym",
  "Swimming Pool",
  "Furnished",
  "Pet Friendly",
  "Washing Machine",
  "Dryer",
  "Balcony",
  "Elevator",
];

export default function PropertyForm({
  initialData,
  categories,
}: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");

  const [location, setLocation] = useState(initialData?.location || "");
  const [price, setPrice] = useState(
    initialData?.price ? String(initialData.price) : "",
  );
  const [bedroomCount, setBedroomCount] = useState(
    initialData?.bedroomCount ? String(initialData.bedroomCount) : "",
  );
  const [bathroomCount, setBathroomCount] = useState(
    initialData?.bathroomCount ? String(initialData.bathroomCount) : "",
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "AVAILABLE" | "RENTED" | "MAINTENANCE"
  >(initialData?.availabilityStatus || "AVAILABLE");
  const [amenities, setAmenities] = useState<string[]>(
    initialData?.amenities || [],
  );
  const [imageUrls, setImageUrls] = useState<string>(
    initialData?.images?.join(", ") || "",
  );

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity]);
    } else {
      setAmenities(amenities.filter((a) => a !== amenity));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !location.trim() ||
      !price ||
      !bedroomCount ||
      !bathroomCount ||
      !categoryId
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const parsedImages = imageUrls
      ? imageUrls
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      : [];

    const payload: IPropertyPayload = {
      title: title.trim(),
      location: location.trim(),
      price: Number(price),
      bedroomCount: Number(bedroomCount),
      bathroomCount: Number(bathroomCount),
      amenities,
      availabilityStatus,
      categoryId,
      images: parsedImages,
    };

    setLoading(true);
    setError(null);
    try {
      let response;
      if (initialData) {
        // Edit Mode
        response = await updateProperty(initialData.id, payload);
      } else {
        // Create Mode
        response = await createProperty(payload);
      }

      if (response.success) {
        toast.success(
          initialData
            ? "Property listing updated successfully!"
            : "Property listed successfully!",
        );
        router.push("/dashboard/landlord");
        router.refresh();
      } else {
        throw new Error(response.message || "Something went wrong.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Property form save error:", err);
      const errMsg = err.message || "An unexpected error occurred.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-600 dark:text-rose-400 flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Listing Error</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label htmlFor="title" className="text-sm font-bold">
            Property Title *
          </Label>
          <Input
            id="title"
            placeholder="e.g. Spacious 2-Bedroom Condo in Downtown"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-bold">
            Category *
          </Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            disabled={loading}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select property category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-bold">
            Location / Address *
          </Label>
          <Input
            id="location"
            placeholder="e.g. Manhattan, New York"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Rent Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-bold">
            Monthly Rent Price ($ USD) *
          </Label>
          <Input
            id="price"
            type="number"
            min="1"
            placeholder="e.g. 1500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Availability Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-bold">
            Availability Status *
          </Label>
          <Select
            value={availabilityStatus}
            onValueChange={(val: PropertyAvailability) =>
              setAvailabilityStatus(val)
            }
            disabled={loading}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select availability status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="RENTED">Rented</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label htmlFor="bedrooms" className="text-sm font-bold">
            Bedroom Count *
          </Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            placeholder="e.g. 2"
            value={bedroomCount}
            onChange={(e) => setBedroomCount(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="text-sm font-bold">
            Bathroom Count *
          </Label>
          <Input
            id="bathrooms"
            type="number"
            min="0"
            placeholder="e.g. 1"
            value={bathroomCount}
            onChange={(e) => setBathroomCount(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Image URLs */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label htmlFor="imageUrls" className="text-sm font-bold">
            Property Image URLs (comma-separated, optional)
          </Label>
          <Input
            id="imageUrls"
            placeholder="e.g. https://domain.com/image1.jpg, https://domain.com/image2.png"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Amenities Selection Checkboxes */}
        <div className="space-y-2.5 col-span-1 md:col-span-2">
          <Label className="text-sm font-bold">Amenities & Features</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-muted/20 p-4 border rounded-xl">
            {AMENITY_OPTIONS.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={amenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity, !!checked)
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-xs font-medium leading-none cursor-pointer"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 border-t pt-5">
        <Button
          asChild
          variant="outline"
          className="flex-1 order-2 sm:order-1"
          disabled={loading}
        >
          <Link href="/dashboard/landlord">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/95 order-1 sm:order-2 gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            "Save Changes"
          ) : (
            "Create Listing"
          )}
        </Button>
      </div>
    </form>
  );
}
