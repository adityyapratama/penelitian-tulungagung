import Navbar from "@/components/game/NavbarDemo";
// import { NavbarDemo } from "@/components/(landing-page)/navbar/navbar";
// import { auth } from "@/auth";

// export default async function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth();

//   return (
//     <>
//       {session ? <Navbar /> : <NavbarDemo />}
//       <main className="landing-font">{children}</main>
//     </>
//   );
// }


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Navbar removed from this layout so nested article detail pages (/[id])
  // render without the navbar. The article list page will render the
  // navbar explicitly.
  return <main className="landing-font">{children}</main>;
}


// 