import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/(landing-page)/register/signin-form";

export default async function SignInPage() {
  const session = await auth();


  if (session?.user) {
    if (session.user.role === "super_admin") {
      redirect("/admin/dashboard");
    } else if (session.user.role === "guru") {
      redirect("/guru/dashboard");
    } else {
      redirect("/dashboard");
    }
  }


  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
      <SignInForm />
    </div>
  );
}