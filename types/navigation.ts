import { type LucideIcon } from "lucide-react";

export type NavItem = {
  [x: string]: any;
  title: string;
  url: string;
  icon?: LucideIcon; 
  items?: {
    title: string;
    url: string;
  }[];
};