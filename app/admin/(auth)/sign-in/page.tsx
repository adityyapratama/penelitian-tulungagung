import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSignInForm } from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Halaman Login Dashboard Admin', 
  description: '',
};

export default async function AdminSignInPage() {
  const session = await auth();

  if (session?.user) redirect("/");

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AdminSignInForm />
      </div>
    </div>
  );
}
