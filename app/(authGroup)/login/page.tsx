// -------- Login Page Entry --------
import { Suspense } from "react";
import { LoginForm } from "../_components/LoginForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Login | RentNest",
  description: "Sign in to your RentNest account to manage properties or rental applications.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}