import { ColumnDef } from "@tanstack/react-table"

export type TColumn = {
    id:number
    username:string
    email:string
    role:string
    last_login:Date | null
}

export const columns: ColumnDef<TColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: "role",
        header: "Role"
    }
]