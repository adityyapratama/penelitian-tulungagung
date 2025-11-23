"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface GuruUserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function GuruUserNav({ user }: GuruUserNavProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GU";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-auto py-2 pl-2 pr-3 rounded-full hover:bg-accent flex items-center gap-3 transition-all border border-transparent hover:border-border"
        >
          {/* 1. Avatar dibuat sedikit lebih besar dan diberi border tipis */}
          <Avatar className="h-9 w-9 border border-muted-foreground/20">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* 2. Menampilkan Nama dan Role secara eksplisit agar tombol terlihat jelas */}
          <div className="flex flex-col items-start text-left hidden sm:flex">
            <span className="text-sm font-semibold leading-none text-foreground">
              {user.name || "Guru"}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Pengajar
            </span>
          </div>

          {/* 3. Ikon Chevron sebagai penanda visual bahwa ini adalah menu dropdown */}
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Header Dropdown */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Menu Profil */}
        <DropdownMenuItem asChild className="cursor-pointer p-3">
          <Link href="/guru/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profil Saya</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Menu Logout */}
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer p-3 bg-red-50 dark:bg-red-950/20 focus:bg-red-100 dark:focus:bg-red-900/40"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}