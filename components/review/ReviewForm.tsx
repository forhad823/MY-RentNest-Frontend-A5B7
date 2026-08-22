"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { submitReview } from "@/service/review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReviewFormProps {
  propertyId: string;
}

export default function ReviewForm({ propertyId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await submitReview({
        propertyId,
        rating,
        comment: comment.trim(),
      });

      if (response.success) {
        toast.success("Review submitted successfully!");
        router.push("/dashboard/tenant");
        router.refresh();
      } else {
        throw new Error(response.message || "Failed to submit review.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Submit review error:", err);
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
            <p className="font-semibold">Submission Failed</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Star Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-foreground">Rating</Label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 hover:scale-110 transition-transform focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-xs font-semibold text-muted-foreground ml-2">
              ({rating} out of 5 stars)
            </span>
          )}
        </div>
      </div>

      {/* Comment Textarea */}
      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm font-bold text-foreground">
          Your Feedback
        </Label>
        <Textarea
          id="comment"
          rows={5}
          placeholder="Share your experience staying at this property (e.g. location, amenities, landlord communication, general impression)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          asChild
          variant="outline"
          className="flex-1 order-2 sm:order-1"
          disabled={loading}
        >
          <Link href="/dashboard/tenant">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
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
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
}
