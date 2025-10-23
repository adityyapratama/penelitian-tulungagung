"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AccInvite, InviteActionResult } from "../lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";

type GroupDetails = {
    group_id: string;
    group_name: string | null;
    group_thumbnail: string | null;
    _count: { GroupMember: number };
};
type MemberDetails = {
    member_id: number;
    foto_profil: string | null;
    User: { username: string | null } | null;
};

interface InviteClientPageProps {
    group: GroupDetails;
    member: MemberDetails;
    isAlreadyMember: boolean;
}

export function InviteClientPage({ group, member, isAlreadyMember }: InviteClientPageProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<InviteActionResult | null>(null);

    const memberCount = group._count?.GroupMember ?? 0;
    const username = member.User?.username ?? "Member";
    const avatar = member.foto_profil;

    const handleAcceptInvite = () => {
        startTransition(async () => {
            const actionResult = await AccInvite(group.group_id);
            setResult(actionResult);

            if (actionResult.success) {
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            }
        });
    };

    if (result) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted p-4">
                <Card className="w-full max-w-md text-center shadow-lg">
                    <CardHeader className="pt-8">
                        {result.success ? (
                            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        ) : (
                            <XCircle className="w-16 h-16 mx-auto text-destructive" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-semibold">
                            {result.success ? "Berhasil!" : "Gagal"}
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            {result.success ? result.success : result.error}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-8">
                        <Button asChild>
                            <Link href="/dashboard">Lanjut ke Dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader className="pt-8 flex flex-col items-center">
                    <p className="text-sm font-semibold text-muted-foreground mb-4">
                        Pusaka Tulungagung
                    </p>
                    <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                        {group.group_thumbnail ? (
                            <AvatarImage src={group.group_thumbnail} alt={group.group_name ?? "Grup"} className="object-cover" />
                        ) : (
                            <AvatarFallback className="text-4xl">
                                <Users />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <p className="text-sm font-medium text-muted-foreground mt-4">
                        Anda diundang untuk bergabung
                    </p>
                    <h2 className="text-2xl font-bold mt-1">{group.group_name || "Grup Tanpa Nama"}</h2>
                    <div className="flex items-center justify-center gap-4 mt-2 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                            <span className="text-sm">{memberCount} Anggota</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="border-t border-border mt-6 pt-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="w-10 h-10">
                            {avatar ? (
                                <AvatarImage src={avatar} alt={username} className="object-cover" />
                            ) : (
                                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                            )}
                        </Avatar>
                        <div className="text-left">
                            <p className="text-sm text-muted-foreground">Bergabung sebagai</p>
                            <p className="font-semibold">{username}</p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col px-6 pb-6">
                    {isAlreadyMember ? (
                        <Button size="lg" className="w-full" asChild>
                            <Link href="/dashboard">Lanjutkan ke Dashboard</Link>
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={handleAcceptInvite}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Terima Undangan"
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}