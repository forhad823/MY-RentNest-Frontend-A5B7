"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <AlertTriangle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">
            <span className="text-green-600">Something</span> went wrong
          </CardTitle>
          <CardDescription>
            An unexpected error occurred. You can try again, and if the problem
            persists, contact support.
          </CardDescription>
        </CardHeader>

        {error?.digest && (
          <CardContent>
            <p className="text-center text-xs text-muted-foreground">
              Error code:{" "}
              <span className="font-mono text-green-600">{error.digest}</span>
            </p>
          </CardContent>
        )}

        <CardFooter className="justify-center">
          <Button
            onClick={() => reset()}
            className="bg-green-600 hover:bg-green-700"
          >
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
