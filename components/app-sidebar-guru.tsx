"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileQuestion,
  BookOpen,
  FileEdit,
  PuzzleIcon,
  ChevronDown,
  LucideIcon
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

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
  items?: { title: string; url: string }[];
}

const guruNavData: NavItem[] = [
  {
    title: "Dashboard Guru",
    url: "/guru/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Manajemen Kuis",
    url: "/guru/dashboard/manage-quiz",
    icon: FileQuestion,
    items: [
      {
        title: "Daftar Kategori",
        url: "/guru/dashboard/manage-quiz/categories",
      },
      {
        title: "Daftar Kuis",
        url: "/guru/dashboard/manage-quiz",
      },
    ],
  },
  {
    title: "Manajemen Cerita",
    url: "/guru/dashboard/manage-stories",
    icon: BookOpen,
    items: [
      {
        title: "Daftar Kategori",
        url: "/guru/dashboard/manage-stories/category",
      },
      {
        title: "Daftar Cerita",
        url: "/guru/dashboard/manage-stories",
      },
    ],
  },
  {
    title: "Manajemen Artikel",
    url: "/guru/dashboard/manage-articles",
    icon: FileEdit,
    items: [
      {
        title: "Daftar Kategori",
        url: "/guru/dashboard/manage-articles/categories",
      },
      {
        title: "Daftar Artikel",
        url: "/guru/dashboard/manage-articles",
      },
    ],
  },
  {
    title: "Manajemen Puzzle",
    url: "/guru/dashboard/manage-puzzles",
    icon: PuzzleIcon,
  },
];

const guruUserData = {
  name: "Nama Guru",
  email: "guru@example.com",
  avatar: "/asset/avatars/avatar-placeholder.png",
};

export function GuruSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>(
    {}
  );

  React.useEffect(() => {
    const newOpenMenus: { [key: string]: boolean } = {};
    guruNavData.forEach((item) => {
      if (item.items && item.url && pathname.startsWith(item.url)) {
        const isSubItemActive = item.items.some(sub => sub.url === pathname);
        if (isSubItemActive || pathname !== item.url) {
           newOpenMenus[item.title] = true;
        }
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
              <a href="/guru/dashboard" className="flex items-center gap-3">
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
          {guruNavData.map((item) => {
            const Icon = item.icon;
            const isParentPotentiallyActive = item.url && pathname.startsWith(item.url) && !(item.exact && pathname !== item.url);

            if (item.items) {
               const isParentActive = isParentPotentiallyActive;

              return (
                <SidebarMenuItem
                  key={item.title}
                  className="flex flex-col items-start"
                >
                  <SidebarMenuButton
                    onClick={() => handleMenuToggle(item.title)}
                    className={cn(
                      "w-full justify-between hover:bg-primary/10",
                      isParentActive && !isCollapsed && "bg-muted text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="!size-4" />}
                      <span className={cn(isCollapsed && "hidden")}>
                        {item.title}
                      </span>
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
                    <div className="flex flex-col gap-1 py-1 pl-6">
                      {item.items.map((subItem) => {
                        const isSubItemActive = pathname === subItem.url;
                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.url}
                            className={cn(
                              "flex items-center gap-3 px-3 py-1.5 text-sm rounded-md transition-colors relative",
                              "hover:bg-primary/10",
                              isSubItemActive
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {isSubItemActive && (
                              <div className="absolute left-[-13px] w-1.5 h-1.5 rounded-full bg-primary" />
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
              : isParentPotentiallyActive;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "hover:bg-primary/10",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Link href={item.url!} className="flex items-center gap-3">
                    {Icon && <Icon className="!size-4" />}
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
        <NavUser user={guruUserData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}