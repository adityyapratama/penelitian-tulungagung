import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}){

    const session = await auth();
    if(!session){
        redirect("/")
    }else if(session.user.role != "super_admin"){
        redirect("/")
    }

    return (
        <div>
            {children}
        </div>
    )
}