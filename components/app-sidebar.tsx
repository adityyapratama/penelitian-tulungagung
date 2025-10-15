"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileQuestion,
  School2Icon,
  FileEdit,
  BookAudioIcon,
  LayoutDashboard,
  PersonStanding,
  Puzzle,
  ChevronDown,
} from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";

const navData = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    exact: true,
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
    subItems: [
      {
        title: "Daftar Kategori",
        url: "/admin/dashboard/manage-stories/category",
      },
      { title: "Daftar Cerita", url: "/admin/dashboard/manage-stories/list" },
    ],
  },
  {
    title: "Manajemen Kuis",
    url: "/admin/dashboard/manage-quiz",
    icon: FileQuestion,
    subItems: [
      {
        title: "Daftar Kategori",
        url: "/admin/dashboard/manage-quiz/categories",
      },
      { title: "Daftar Kuis", url: "/admin/dashboard/manage-quiz/quiz" },
    ],
  },
  {
    title: "Manajemen Sekolah",
    url: "/admin/dashboard/manage-sekolah",
    icon: School2Icon,
  },
];

const userData = {
  name: "Administrator",
  email: "adminpusakatulungagung@gmail.com",
  avatar: "/asset/avatars/avatar-image-1.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>(
    {}
  );

  React.useEffect(() => {
    const newOpenMenus: { [key: string]: boolean } = {};
    navData.forEach((item) => {
      if (item.subItems && item.url && pathname.startsWith(item.url)) {
        newOpenMenus[item.title] = true;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  const handleMenuToggle = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-primary/10"
            >
              <a href="/admin/dashboard" className="flex items-center gap-3">
                <Image
                  alt="logo-dashboard"
                  src={"/asset/unair.png"}
                  width={24}
                  height={24}
                  className="!size-5"
                />
                <span
                  className={cn(
                    "text-base font-semibold",
                    isCollapsed && "hidden"
                  )}
                >
                  Pusaka Tulungagung
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navData.map((item) => {
            const Icon = item.icon;
            const isParentActive = item.url && pathname.startsWith(item.url);

            if (item.subItems) {
              return (
                <SidebarMenuItem
                  key={item.title}
                  className="flex flex-col items-start"
                >
                  <SidebarMenuButton
                    onClick={() => handleMenuToggle(item.title)}
                    className={cn(
                      "w-full justify-between hover:bg-primary/10",
                      isParentActive &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {" "}
                      <Icon className="!size-4" />{" "}
                      <span className={cn(isCollapsed && "hidden")}>
                        {item.title}
                      </span>{" "}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        openMenus[item.title] && "rotate-180",
                        isCollapsed && "hidden"
                      )}
                    />
                  </SidebarMenuButton>
                  <div
                    className={cn(
                      "w-full pl-5 mt-1 relative transition-all duration-300 ease-in-out overflow-hidden",
                      openMenus[item.title] && !isCollapsed
                        ? "max-h-96"
                        : "max-h-0"
                    )}
                  >
                    <div className="absolute left-6 top-1 bottom-1 w-px bg-slate-300 dark:bg-slate-700" />
                    <div className="flex flex-col gap-1 pl-6">
                      {item.subItems.map((subItem) => {
                        const isSubItemActive = pathname === subItem.url;
                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.url}
                            className={cn(
                              "flex items-center gap-3 px-3 py-1.5 text-sm rounded-md transition-colors",
                              "hover:bg-primary/10",
                              isSubItemActive
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className="w-1.5 h-1.5 rounded-full transition-colors bg-transparent" />
                            {isSubItemActive && (
                              <div className="absolute left-[21px] w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                            <span>{subItem.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </SidebarMenuItem>
              );
            }

            const isActive = item.exact
              ? pathname === item.url
              : isParentActive;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "hover:bg-primary/10",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Link href={item.url!} className="flex items-center gap-3">
                    <Icon className="!size-4" />
                    <span className={cn(isCollapsed && "hidden")}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
