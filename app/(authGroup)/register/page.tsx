// -------- Registration Page Entry --------
import { Suspense } from "react";
import { RegisterForm } from "../_components/RegisterForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Register | RentNest",
  description: "Create an account on RentNest as a Tenant or Landlord.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
