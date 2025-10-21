import { AppSidebar } from "@/components/app-sidebar";
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
import {
  LayoutDashboard,
  FileQuestion,
  BookOpen,
} from "lucide-react"; 
import { AppSidebarGuru } from "@/components/app-sidebar-guru";
import { GetGuruById } from "../lib/actions";

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

  if (session?.user.role != "guru") {
    redirect("/");
  }
   const guru = await GetGuruById(session.user.id!)
   console.log(guru)
  if (guru == null){
          redirect("/guru/register")
  }

  return (
    <SidebarProvider>
      <AppSidebarGuru />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          <Toaster position="top-right" />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}