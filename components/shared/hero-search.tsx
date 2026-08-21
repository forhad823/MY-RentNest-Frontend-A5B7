"use client";

// -------- Hero Search Form Component --------
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearchForm() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
    if (location.trim()) params.set("location", location.trim());

    const queryString = params.toString();
    router.push(`/properties${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-center gap-3 p-3 bg-background/95 backdrop-blur-md rounded-2xl shadow-xl border w-full max-w-3xl"
    >
      {/* Property Keyword / Title Input */}
      <div className="flex items-center gap-2 px-3 py-2 w-full md:flex-1 border-b md:border-b-0 md:border-r border-border">
        <Search className="h-5 w-5 text-primary shrink-0" />
        <Input
          type="text"
          placeholder="City, apartment, title, or feature..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Location Input */}
      <div className="flex items-center gap-2 px-3 py-2 w-full md:flex-1">
        <MapPin className="h-5 w-5 text-primary shrink-0" />
        <Input
          type="text"
          placeholder="Location (e.g. New York, London)..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full md:w-auto px-8 rounded-xl font-semibold shadow-md"
      >
        <Search className="mr-2 h-4 w-4" />
        Find Rentals
      </Button>
    </form>
  );
}
