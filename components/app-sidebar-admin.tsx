"use client";

import * as React from "react";
import Image from "next/image";
import {
  FileQuestion,
  School2Icon,
  FileEdit,
  BookAudioIcon,
  LayoutDashboard,
  PersonStanding,
  Puzzle,
  type LucideIcon, 
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

const adminNavData: {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: { title: string; url: string }[];
}[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manajemen Pengguna",
    url: "/admin/dashboard/manage-users",
    icon: PersonStanding,
  },
  {
    title: "Manajemen Artikel",
    url: "/admin/dashboard/manage-articles",
    icon: FileEdit,
  },
  {
    title: "Manajemen Puzzle",
    url: "/admin/dashboard/manage-puzzles",
    icon: Puzzle,
  },
  {
    title: "Manajemen Cerita",
    url: "/admin/dashboard/manage-stories",
    icon: BookAudioIcon,
    items: [
      {
        title: "Daftar Cerita",
        url: "/admin/dashboard/manage-stories",
      },
      {
        title: "Daftar Kategori",
        url: "/admin/dashboard/manage-stories/category",
      },
    ],
  },
  {
    title: "Manajemen Kuis",
    url: "/admin/dashboard/manage-quiz",
    icon: FileQuestion,
    items: [
      {
        title: "Daftar Kuis Kategori",
        url: "/admin/dashboard/manage-quiz/categories",
      },
      {
        title: "Daftar Kuis",
        url: "/admin/dashboard/manage-quiz/quiz",
      },
    ],
  },
  {
    title: "Manajemen sekolah",
    url: "/admin/dashboard/manage-sekolah",
    icon: School2Icon,
  },
];

const adminUserData = {
  name: "Administrator",
  email: "adminpusakatulungagung@gmail.com",
  avatar: "/asset/avatars/avatar-image-1.jpg",
};

export function AppSidebarAdmin({
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
        <NavMain items={adminNavData} /> 
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminUserData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}