import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/(landing-page)/register/signin-form";
import prisma  from "@/lib/prisma";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "super_admin") {
      redirect("/admin/dashboard");
    } else if (session.user.role === "guru") {
      redirect("/guru/dashboard");
    } else if (session.user.role === "member") {
      // Cek apakah user sudah memiliki data member
      const existingMember = await prisma.member.findUnique({
        where: { user_id: Number(session.user.id) }
      });

      if (!existingMember) {
        // Jika belum ada data member, redirect ke halaman register member
        redirect("/member/register");
      } else {
        // Jika sudah ada data member, redirect ke games
        redirect("/games");
      }
    } else {
      // Default redirect untuk role lain
      redirect("/games");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen font-sans bg-gray-100">
      <SignInForm />
    </div>
  );
}