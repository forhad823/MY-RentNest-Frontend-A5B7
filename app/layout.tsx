import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { getServerSession } from "@/lib/auth-session";
import { Navbar } from "@/components/shared/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Toaster position="top-right" richColors />
        
        {/* Navigation Header */}
        <Navbar user={session.user} />

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Footer placeholder */}
      </body>
    </html> 
  );
}       
