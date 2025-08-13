import { ColumnDef } from "@tanstack/react-table";

export type TColumn = {
  id: number;
  username: string;
  email: string;
  role: string;
  last_login: Date | null;
};

export const columns: ColumnDef<TColumn, any>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "last_login",
    header: "Last Login",
  },
];
