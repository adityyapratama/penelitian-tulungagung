import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Metadata } from "next";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import {
  FileQuestion,
  School2Icon,
  FileEdit,
  LayoutDashboard,
  PersonStanding,
  Puzzle,
  BookAudioIcon,
  BookOpen,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pusaka Tulungagung - Dashboard Admin",
  description: "Pusaka Tulungagung Dashboard Admin",
};

import { Toaster } from "sonner";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role != "super_admin") {
    return <p>You are not authorized to view this page!</p>;
  }
  return (
    <SidebarProvider>
      {" "}
      <div className="flex min-h-screen w-full bg-muted/40">
        {" "}
        <AppSidebar />{" "}
        <SidebarInset className="flex flex-1 flex-col min-w-0">
          {" "}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            {" "}
            <SidebarTrigger className="-ml-1" />{" "}
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />{" "}
            <DynamicBreadcrumb />{" "}
          </header>{" "}
          <main className="flex-1 overflow-y-auto p-4 pt-0">
            {" "}
            <Toaster position="top-right" /> {children}{" "}
          </main>{" "}
        </SidebarInset>{" "}
      </div>{" "}
    </SidebarProvider>
  );
}
