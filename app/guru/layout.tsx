import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GetGuruById } from "./lib/actions";

export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}){

    const session = await auth();
    if(!session){
        redirect("/")
    }else if(session.user.role != "guru"){
        redirect("/")
    }
    return (
        <div>
            {children}
        </div>
    )
}