import Navbar from "@/components/game/NavbarDemo";
import { NavbarDemo } from "@/components/(landing-page)/navbar/navbar";
import { auth } from "@/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      {session ? <Navbar /> : <NavbarDemo />}
      <main>{children}</main>
    </>
  );
}
