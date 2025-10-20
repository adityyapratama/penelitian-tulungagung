"use client";

import * as React from "react";
import Image from "next/image";

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
import { type NavItem } from "@/types/navigation";
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navData: NavItem[]; 
}

const userData = {
  name: "User Name",
  email: "user@example.com",
  avatar: "/asset/avatars/avatar-image-1.jpg",
};


export function AppSidebar({ navData, ...props }: AppSidebarProps) {
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
        <NavMain items={navData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} /> 
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}