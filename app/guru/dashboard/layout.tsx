import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Metadata } from "next";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GuruSidebar } from "@/components/app-sidebar-guru";
import { GetGuruById } from "../lib/actions";
import { GuruUserNav } from "@/components/guru-user-nav"; // Import komponen baru

export const metadata: Metadata = {
  title: "Pusaka Tulungagung - Dashboard Guru",
  description: "Pusaka Tulungagung Dashboard Guru",
};

export default async function GuruDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "guru") {
    redirect("/");
  }

  // Cek apakah data guru sudah ada
  const guru = await GetGuruById(session.user.id!);
  if (guru == null || "error" in guru) {
    redirect("/guru/register"); 
  }

  return (
    <SidebarProvider>
      <GuruSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background px-4">
          
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>

          <div className="ml-auto flex items-center gap-2">
 
             <GuruUserNav user={session.user} />
          </div>

        </header>

        <div className="flex flex-col flex-1 gap-4 p-4 pt-0 mt-4">
          <Toaster position="top-right" />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}