import prisma from "@/lib/prisma";
import { TColumn } from "../columns";

export async function getUsers(){
    try {
        const users = await prisma.user.findMany({})

        const response: TColumn[] = users.map((user) => {
            return {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role:user.role,
                last_login:user.last_login
            }
        })

        return response
    } catch (error) {
        console.log(error);
        return []
    }
}