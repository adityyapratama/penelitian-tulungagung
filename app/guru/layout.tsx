import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GetGuruById,InviteByEmail } from "./lib/actions";



export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}){

    const session = await auth();
     await InviteByEmail("helloadityapratamaa@gmail.com","D5462")
    if(!session){
        redirect("/")
    }else if(session.user.role != "guru"){
        redirect("/")
    }
    const guru = await GetGuruById(session.user.id!)
    if (guru == null){
        redirect("/guru/register")
    }
    return (
        <div>
            {children}
        </div>
    )
}