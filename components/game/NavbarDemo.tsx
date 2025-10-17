"use client";

import { useState } from "react";
import { Home, Book, Trophy, User, Menu, X, Flame, Zap, LogOut, Settings, Bell, HelpCircle, ChevronDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
// import { handleLogout } from "@/lib/auth-actions";

const navItems = [
  { title: "Home", url: "/games", icon: Home },
  { title: "Games", url: "/learn", icon: Zap },
  { title: "Article", url: "/article", icon: Book },
  { title: "Leaderboard", url: "/profile/leaderboard", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

          {/* Stats & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-xl">
              <div className="flex items-center gap-1.5">
                <Flame className="h-5 w-5 text-secondary animate-bounce-subtle" />
                <span className="font-bold text-sm">7</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Zap className="h-5 w-5 text-accent" />
                <span className="font-bold text-sm">1,250</span>
              </div>
            </div>
            
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all gap-1"
                >
                  Lainnya
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/help" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* <DropdownMenuItem 
                  className="text-destructive focus:text-destructive cursor-pointer"
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
                </DropdownMenuItem> */}
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
                  <span className="font-bold">7 day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-bold">1,250 XP</span>
                </div>
              </div>
              
              {/* Mobile Menu Items */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-all"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-all"
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
                
                <Link
                  href="/help"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-all"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help & Support</span>
                </Link>
                
                {/* <button
                  onClick={async () => {
                    setIsOpen(false);
                    try {
                      await handleLogout();
                    } catch (error) {
                      console.error("Failed to logout:", error);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;