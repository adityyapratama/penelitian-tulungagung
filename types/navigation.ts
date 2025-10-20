import { type LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon; 
  items?: {
    title: string;
    url: string;
  }[];
};