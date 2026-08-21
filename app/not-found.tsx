"use client";

import Link from "next/link"; // Change to react-router-dom 'Link' or 'useNavigate' if using Vite/React Router
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      <div className="text-center max-w-md space-y-6">
        {/* Icon Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm">
          <AlertCircle className="h-10 w-10 text-primary" />
        </div>

        {/* Error Code & Heading */}
        <div className="space-y-2">
          <span className="text-sm font-semibold tracking-wider text-primary uppercase">
            404 Error
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Page not found
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Sorry, we could not find the page you are looking for. It might have
            been removed or the link is broken.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>

          <Button asChild className="w-full sm:w-auto gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
