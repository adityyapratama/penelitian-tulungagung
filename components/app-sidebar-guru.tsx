"use client";

import * as React from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  FileQuestion,
  BookOpen,
  FileEdit,
  type LucideIcon,
  PuzzleIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const guruNavData: {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: { title: string; url: string }[];
}[] = [
  {
    title: "Dashboard Guru",
    url: "/guru/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manajemen Kuis Saya",
    url: "/guru/dashboard/my-quiz",
    icon: FileQuestion,
  },
  {
    title: "Manajemen Cerita Saya",
    url: "/guru/dashboard/manage-stories",
    icon: BookOpen,
  },
  {
    title: "Manajemen Artikel Saya", 
    url: "/guru/dashboard/manage-articles",
    icon: FileEdit,  
  },
  {
    title: "Manajemen Puzzle Saya",
    url: "/guru/dashboard/my-puzzles",
    icon: PuzzleIcon,
  },
];

const guruUserData = {
  name: "Guru Pengajar",
  email: "guru@pusakatulungagung.com",
  avatar: "/asset/avatars/avatar-image-2.jpg",
};

export function AppSidebarGuru({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  alt="logo-dashboard"
                  src={"/asset/unair.png"}
                  width={24}
                  height={24}
                  className="!size-5"
                />
                <span className="text-base font-semibold">
                  Pusaka Tulungagung
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={guruNavData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={guruUserData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
