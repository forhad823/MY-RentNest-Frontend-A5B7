import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Suspense } from "react";
import "./globals.css";

import { getServerSession } from "@/lib/auth-session";
import { Navbar } from "@/components/shared/navbar";
import { NavbarSkeleton } from "@/components/shared/page-skeletons";

export const instant = false;

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// -------- Session-Aware Navbar Wrapper --------
/**** Reads the session at request time inside a Suspense boundary so the root shell can prerender instantly without blocking on cookies or JWT verification (which reads Date.now() internally).
 ****/
async function SessionNavbar() {
  const session = await getServerSession();
  return <Navbar user={session.user} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground mx-auto max-w-full">
        <Toaster position="top-right" richColors />

        {/* Navigation Header (streams in after session resolution) */}
        <Suspense fallback={<NavbarSkeleton />}>
          <SessionNavbar />
        </Suspense>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Footer placeholder */}
      </body>
    </html>
  );
}
