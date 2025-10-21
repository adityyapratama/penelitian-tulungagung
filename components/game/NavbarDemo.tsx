"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Home, Book, Trophy, User, Menu, X, Flame, Zap, LogOut, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GetMemberData, GetExpMember } from "@/app/(member)/lib/actions";

const navItems = [
  { title: "Home", url: "/games", icon: Home },
  { title: "Learn", url: "/learn", icon: Book },
  { title: "Leaderboard", url: "/profile/leaderboard", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

const handleLogout = async () => {
  await signOut({ callbackUrl: "/" });
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // State untuk data member
  const [memberData, setMemberData] = useState<{
    username: string;
    email: string;
    level: number;
    foto_profil: string | null;
  } | null>(null);
  const [totalXp, setTotalXp] = useState<number>(0);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!session?.user) return;

      const memberResult = await GetMemberData();
      
      if (!memberResult || 'error' in memberResult) return;

      // Set member data
      setMemberData({
        username: memberResult.User?.username || session.user.name || "User",
        email: memberResult.User?.email || session.user.email || "",
        level: memberResult.level || 1,
        foto_profil: memberResult.foto_profil || session.user.image || null,
      });

      // Get XP
      if (memberResult.member_id) {
        const xp = await GetExpMember(String(memberResult.member_id));
        setTotalXp(xp || 0);
      }
    };

    fetchMemberData();
  }, [session]);

  // Fallback values
  const username = memberData?.username || session?.user?.name || "User";
  const email = memberData?.email || session?.user?.email || "";
  const level = memberData?.level || 1;
  const fotoProfil = memberData?.foto_profil || session?.user?.image || "";
  const avatarFallback = username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg blur-sm group-hover:blur-md transition-all" />
              <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-xl px-3 py-1.5 rounded-lg">
                Pusaka TulungAgung
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                    "hover:bg-muted hover:scale-105",
                    isActive && "bg-primary/10 text-primary font-semibold"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Stats & Profile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-xl">
              <div className="flex items-center gap-1.5">
                <Flame className="h-5 w-5 text-secondary animate-bounce-subtle" />
                <span className="font-bold text-sm">0</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Zap className="h-5 w-5 text-accent" />
                <span className="font-bold text-sm">{totalXp.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={fotoProfil} alt="Profile" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Level {level} • {totalXp.toLocaleString()} XP
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  <Badge variant="secondary" className="ml-auto">3</Badge>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={async () => {
                    try {
                      await handleLogout();
                    } catch (error) {
                      console.error("Failed to logout:", error);
                    }
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      "hover:bg-muted",
                      isActive && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
              
              <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-xl mt-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-secondary" />
                  <span className="font-bold">0 day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-bold">{totalXp.toLocaleString()} XP</span>
                </div>
              </div>
              
              {/* Mobile Profile & Menu Items */}
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" className="justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  <Badge variant="secondary" className="ml-auto">3</Badge>
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="justify-start"
                  // onClick={async () => {
                  //   setIsOpen(false);
                  //   try {
                  //     await handleLogout();
                  //   } catch (error) {
                  //     console.error("Failed to logout:", error);
                  //   }
                  // }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;