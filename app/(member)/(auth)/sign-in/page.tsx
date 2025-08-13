import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/(landing-page)/signinform/signin-form";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
      <SignInForm />
    </div>
  );
}