import { auth } from "@/auth";

export default async function InviteLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>){

    const session = await auth()

    if (!session) {
        return <div>
            <p>Silahkan Login Terlebih Dahulu</p>
            <a href="/sign-in">Sign-in</a>
        </div>
    }else if (session.user.role != "member"){
        return <div>
            <p>Anda Bukanlah Member</p>
        </div>
    }

    return (
        <div>{children}</div>
    )
}