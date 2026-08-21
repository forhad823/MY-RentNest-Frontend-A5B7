"use client";

// -------- Responsive Navigation Header Component --------
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu,
  Building,
  PlusCircle,
  FileText,
  Shield,
  LogIn,
  UserPlus,
} from "lucide-react";

import { TAuthUser } from "@/lib/auth-session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/shared/user-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  user: TAuthUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic Navigation items based on Auth & Role
  const getNavLinks = () => {
    const baseLinks = [
      { label: "Home", href: "/" },
      { label: "Browse Properties", href: "/properties" },
    ];

    if (!user) return baseLinks;

    switch (user.role) {
      case "TENANT":
        return [
          ...baseLinks,
          { label: "My Requests", href: "/dashboard/tenant" },
        ];
      case "LANDLORD":
        return [
          ...baseLinks,
          { label: "My Listings", href: "/dashboard/landlord" },
          { label: "Add Listing", href: "/dashboard/landlord/properties/new" },
        ];
      case "ADMIN":
        return [
          ...baseLinks,
          { label: "Moderation", href: "/dashboard/admin" },
        ];
      default:
        return baseLinks;
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Rent<span className="text-primary">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions & User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {user.role === "LANDLORD" && (
                <Button asChild size="sm" variant="outline" className="gap-1.5">
                  <Link href="/dashboard/landlord/properties/new">
                    <PlusCircle className="h-4 w-4 text-primary" />
                    Post Property
                  </Link>
                </Button>
              )}
              <UserNav user={user} />
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Log in
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="flex md:hidden items-center space-x-2">
          {user && <UserNav user={user} />}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Navigation Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <SheetHeader className="text-left border-b pb-4">
                <SheetTitle className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                    <Home className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-bold">RentNest</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col space-y-3 py-6">
                <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigation
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                      pathname === link.href
                        ? "bg-accent text-primary font-semibold"
                        : "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="flex flex-col space-y-2 border-t pt-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
