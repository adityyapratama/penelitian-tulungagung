"use client";

import * as React from "react";
import Image from "next/image";
import { FileQuestion } from "lucide-react";
import {
  BookAudioIcon,
  LayoutDashboard,
  PersonStanding,
  Puzzle,
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

const data = {
  navMain: [
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
          title: "Daftar Pengguna",
          url: "/admin/dashboard/manage-users",
        },
        {
          title: "Daftar Cerita",
          url: "/admin/dashboard/manage-stories",
        },
        {
          title: "Tambah Cerita",
          url: "/admin/dashboard/manage-stories/create",
        },
      ],
    },
    
    {
      title: "Manajemen Kuis",
      url: "/admin/dashboard/manage-quiz",
      icon: FileQuestion,
      items: [
         {
          title: "index kuis kategori",
          url: "/admin/dashboard/manage-quiz/categories",
        },
        {
          title: "Tambah pertanyaan",
          url: "/admin/dashboard/manage-quiz/quiz",
        },
      ],
    },
    
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const loggedInUser = {
    name: user.name ?? "User", 
    email: user.email ?? "",
    avatar: user.image, 
  };

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
                <span className="text-base font-semibold">Pusaka Tulungagung</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={loggedInUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}