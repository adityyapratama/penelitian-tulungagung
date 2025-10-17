import Navbar  from "@/components/game/NavbarDemo";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar/>
      <main className="pt-20">
        {children}
      </main>
    </>
  );
}