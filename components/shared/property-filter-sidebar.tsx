"use client";

// -------- Property Filter Sidebar Component --------
import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  RotateCcw,
  Search,
  DollarSign,
  Bed,
  Bath,
  Layers,
} from "lucide-react";

import { TCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POPULAR_AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Gym",
  "Parking",
  "Pool",
  "Balcony",
  "Pet Friendly",
  "Furnished",
];

interface PropertyFilterSidebarProps {
  categories: TCategory[];
}

export function PropertyFilterSidebar({
  categories,
}: PropertyFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current query values directly from URL searchParams
  const categoryId = searchParams.get("categoryId") || "ALL";
  const bedroomCount = searchParams.get("bedroomCount") || "ALL";
  const bathroomCount = searchParams.get("bathroomCount") || "ALL";
  const selectedAmenities = searchParams.getAll("amenities");

  // -------- Debounce refs for text inputs (500ms) --------
  const searchTermTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minPriceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxPriceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------- Instant URL Param Updater --------
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  };

  // -------- Debounced URL updater for text inputs --------
  const debouncedPushParam = (
    key: string,
    value: string,
    timerRef: React.RefObject<ReturnType<typeof setTimeout> | null>,
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`/properties?${params.toString()}`);
    }, 500);
  };

  // -------- Amenity Toggle --------
  const toggleAmenity = (amenity: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("amenities");
    params.delete("amenities");

    if (current.includes(amenity)) {
      current
        .filter((a) => a !== amenity)
        .forEach((a) => params.append("amenities", a));
    } else {
      [...current, amenity].forEach((a) => params.append("amenities", a));
    }

    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  };

  // -------- Reset All Filters --------
  const handleResetFilters = () => {
    [
      searchTermTimerRef,
      locationTimerRef,
      minPriceTimerRef,
      maxPriceTimerRef,
    ].forEach((ref) => {
      if (ref.current) clearTimeout(ref.current);
    });
    router.push("/properties");
  };

  return (
    <div className="bg-card border rounded-2xl p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            Filter Properties
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {/* Keyword Search — 500ms debounce */}
      <div className="space-y-2">
        <Label
          htmlFor="filter-search"
          className="text-xs font-semibold text-muted-foreground uppercase"
        >
          Search Keyword
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="filter-search"
            placeholder="Title or keywords..."
            defaultValue={searchParams.get("searchTerm") ?? ""}
            onChange={(e) =>
              debouncedPushParam(
                "searchTerm",
                e.target.value,
                searchTermTimerRef,
              )
            }
            className="pl-9"
          />
        </div>
      </div>

      {/* Location — 500ms debounce */}
      <div className="space-y-2">
        <Label
          htmlFor="filter-location"
          className="text-xs font-semibold text-muted-foreground uppercase"
        >
          Location
        </Label>
        <Input
          id="filter-location"
          placeholder="City, neighborhood..."
          defaultValue={searchParams.get("location") ?? ""}
          onChange={(e) =>
            debouncedPushParam("location", e.target.value, locationTimerRef)
          }
        />
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" /> Category
        </Label>
        <Select
          key={`cat-${categoryId}`}
          value={categoryId}
          onValueChange={(val) => updateParam("categoryId", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((cat, index) => (
              <SelectItem key={cat.id + index} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range — 500ms debounce */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5" /> Monthly Rent Range ($)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onChange={(e) =>
              debouncedPushParam("minPrice", e.target.value, minPriceTimerRef)
            }
            min={0}
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onChange={(e) =>
              debouncedPushParam("maxPrice", e.target.value, maxPriceTimerRef)
            }
            min={0}
          />
        </div>
      </div>

      {/* Bedroom & Bathroom Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" /> Bedrooms
          </Label>
          <Select
            key={`bed-${bedroomCount}`}
            value={bedroomCount}
            onValueChange={(val) => updateParam("bedroomCount", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="ALL">Any</SelectItem>
              <SelectItem value="1">1 Bed</SelectItem>
              <SelectItem value="2">2 Beds</SelectItem>
              <SelectItem value="3">3 Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> Bathrooms
          </Label>
          <Select
            key={`bath-${bathroomCount}`}
            value={bathroomCount}
            onValueChange={(val) => updateParam("bathroomCount", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="ALL">Any</SelectItem>
              <SelectItem value="1">1 Bath</SelectItem>
              <SelectItem value="2">2 Baths</SelectItem>
              <SelectItem value="3">3+ Baths</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div className="space-y-3 border-t pt-4">
        <Label className="text-xs font-semibold text-muted-foreground uppercase">
          Amenities
        </Label>
        <div className="grid grid-cols-1 gap-2.5">
          {POPULAR_AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm font-medium leading-none cursor-pointer select-none"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
