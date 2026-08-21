// -------- Centered Auth Layout Wrapper --------
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8 bg-muted/30">
      <div className="w-full max-w-md flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
