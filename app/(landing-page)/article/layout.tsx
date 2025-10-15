import { NavbarDemo } from "@/components/(landing-page)/navbar/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarDemo />
      <main>
        {children}
      </main>
    </>
  );
}