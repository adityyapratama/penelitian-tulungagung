import { redirect } from "next/navigation"
import { GetMemberData } from "../lib/actions"
import UserDashboard from "./_components/UserDahsboard"

export default async function Page(){
    const member = await GetMemberData()

    if (!member){
        redirect("/member/register")
    }
    return (
        <UserDashboard member={member}/>
    )
}