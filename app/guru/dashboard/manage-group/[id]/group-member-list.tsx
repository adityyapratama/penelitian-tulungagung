"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, UserX, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// import { removeMemberFromGroup, ContentActionResult } from "../lib/actions";
import type { GroupMemberWithDetails } from "../lib/data";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useRouter } from "next/navigation";

dayjs.locale("id");

interface GroupMemberListProps {
    groupId: string;
    members: GroupMemberWithDetails[];
}

export function GroupMemberList({ groupId, members }: GroupMemberListProps) {
    const [isPending, startTransition] = useTransition();
    const [itemToDelete, setItemToDelete] = useState<GroupMemberWithDetails | null>(null);
    const router = useRouter();

    // const handleRemove = (memberId: number, username: string) => {
    //     startTransition(async () => {
    //          const result: ContentActionResult = await removeMemberFromGroup(groupId, memberId);
    //          if (result.success) {
    //              toast.success(result.success);
    //              setItemToDelete(null);
    //              router.refresh();
    //          } else {
    //              toast.error("Gagal Mengeluarkan Member", { description: result.error });
    //          }
    //     });
    // };

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[80px]">Avatar</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Bergabung</TableHead>
                        <TableHead className="text-right w-[80px]">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                Belum ada anggota di grup ini.
                            </TableCell>
                        </TableRow>
                    )}
                    {members.map((gm) => {
                        const member = gm.Member;
                        const user = member?.User;
                        const username = user?.username ?? 'N/A';
                        const avatar = member?.foto_profil ?? user?.Member?.foto_profil ?? null;

                        return (
                            <TableRow key={gm.member_id} className="hover:bg-muted/20">
                                <TableCell className="p-2">
                                     <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center flex-shrink-0 relative">
                                        {avatar ? (
                                            <Image
                                                src={avatar}
                                                alt={`Avatar ${username}`}
                                                fill
                                                className="object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ) : (
                                            <Users className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{username}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-muted-foreground text-sm">{user?.email ?? 'N/A'}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-muted-foreground text-sm whitespace-nowrap">
                                        {dayjs(gm.tanggal_bergabung).format('DD MMM YYYY')}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right p-2">
                                     <AlertDialog onOpenChange={(open) => !open && setItemToDelete(null)}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => setItemToDelete(gm)}
                                                disabled={isPending && itemToDelete?.member_id === gm.member_id}
                                            >
                                                {isPending && itemToDelete?.member_id === gm.member_id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin"/>
                                                ) : (
                                                    <UserX className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </AlertDialogTrigger>
                                         <AlertDialogContent>
                                             <AlertDialogHeader>
                                                 <AlertDialogTitle>Keluarkan Anggota?</AlertDialogTitle>
                                                 <AlertDialogDescription>
                                                     Anda yakin ingin mengeluarkan <span className="font-semibold">{username}</span> dari grup ini?
                                                 </AlertDialogDescription>
                                             </AlertDialogHeader>
                                             {/* <AlertDialogFooter>
                                                 <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                                                 <AlertDialogAction onClick={() => handleRemove(gm.member_id, username)} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                                                     {isPending ? "Mengeluarkan..." : "Ya, Keluarkan"}
                                                 </AlertDialogAction>
                                             </AlertDialogFooter> */}
                                         </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}