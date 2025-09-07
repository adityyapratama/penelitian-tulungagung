import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/(landing-page)/register/sign-up-form-user";

export default async function SignInPage() {
  const session = await auth();


  if (session?.user) {
    if (session.user.role === "super_admin") {
      redirect("/admin/dashboard");
    } else if (session.user.role === "guru") {
      redirect("/guru/dashboard");
    } else {
      redirect("/");
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen font-sans bg-gray-100">
      <SignUpForm />
    </div>
  );
}