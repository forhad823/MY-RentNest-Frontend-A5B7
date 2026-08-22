"use client";

// -------- Property Image Gallery Component --------
import { useState } from "react";
import Image from "next/image";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImageGalleryProps {
  images?: string[];
  title: string;
}

export function PropertyImageGallery({
  images = [],
  title,
}: PropertyImageGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const hasImages = images && images.length > 0;
  const activeImage = hasImages ? images[selectedIdx] || images[0] : null;

  if (!hasImages) {
    return (
      <div className="relative w-full h-72 md:h-96 rounded-2xl bg-muted/60 border flex flex-col items-center justify-center text-muted-foreground overflow-hidden shadow-inner">
        <Home className="h-16 w-16 mb-2 opacity-30" />
        <span className="text-sm font-medium">No images uploaded for this listing</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Large Display Image */}
      <div className="relative w-full h-80 sm:h-96 md:h-115 rounded-2xl bg-muted border overflow-hidden shadow-md">
        <Image
          src={activeImage!}
          alt={`${title} - photo ${selectedIdx + 1}`}
          fill
          priority
          unoptimized
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((imgUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIdx(index)}
              className={cn(
                "relative h-20 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                selectedIdx === index
                  ? "border-primary ring-2 ring-primary/30 scale-102"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-muted-foreground/30",
              )}
            >
              <Image
                src={imgUrl}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
