"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProperty } from "@/service/landlord";
import { Button } from "@/components/ui/button";

interface DeletePropertyButtonProps {
  propertyId: string;
}

export default function DeletePropertyButton({
  propertyId,
}: DeletePropertyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this property listing? This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteProperty(propertyId);
      if (response.success) {
        toast.success("Property listing deleted successfully.");
        router.refresh();
      } else {
        throw new Error(
          response.message || "Failed to delete property listing.",
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Delete property error:", err);
      toast.error(
        err.message || "An error occurred while deleting the property.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
