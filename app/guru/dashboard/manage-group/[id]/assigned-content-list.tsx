"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Loader2, HelpCircle, BookText, Puzzle } from "lucide-react";
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
// --- PERBAIKI IMPOR ---
import { DeleteGroupContent, ContentActionResult } from "../../../lib/actions"; // Path ../../
import type { GroupContentWithDetails } from "../lib/data"; // Path ../../
// ----------------------
import { useRouter } from "next/navigation"; 

type AssignedContentItem = GroupContentWithDetails; 

interface AssignedContentListProps {
    groupId: string;
    assignedContent: AssignedContentItem[];
}

export function AssignedContentList({ groupId, assignedContent }: AssignedContentListProps) {
    const [isPending, startTransition] = useTransition();
    const [itemToDelete, setItemToDelete] = useState<AssignedContentItem | null>(null);
    const router = useRouter(); 

    const getTitle = (item: AssignedContentItem): string => {
        switch (item.content_type) {
            case 'kuis': return item.Kuis?.judul ?? `Kuis ID ${item.content_id}`;
            case 'cerita': return item.CeritaInteraktif?.judul ?? `Cerita ID ${item.content_id}`;
            case 'puzzle': return item.Puzzle?.judul ?? `Puzzle ID ${item.content_id}`;
            default: return `Konten ID ${item.content_id}`;
        }
    };

    const getIcon = (type: AssignedContentItem['content_type']) => {
        switch (type) {
            case 'kuis': return <HelpCircle className="w-4 h-4 text-blue-500" />;
            case 'cerita': return <BookText className="w-4 h-4 text-green-500" />;
            case 'puzzle': return <Puzzle className="w-4 h-4 text-orange-500" />;
            default: return null;
        }
    };

    const handleDelete = (item: AssignedContentItem) => {
        if (!item) return;
        setItemToDelete(item); 

        startTransition(async () => {
             const payload = {
                 group_id: groupId,
                 contents: [{ 
                    content_type: item.content_type,
                    content_id: item.content_id
                 }]
             };

             const result: ContentActionResult = await DeleteGroupContent(payload);

             if (result.success) {
                 toast.success(result.success);
                 router.refresh(); 
             } else {
                 toast.error("Gagal Menghapus", { description: result.error || "Terjadi kesalahan." });
             }
             setItemToDelete(null); 
        });
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px] px-3"></TableHead>
                        <TableHead>Judul Konten</TableHead>
                        <TableHead className="text-right w-[80px] px-3">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assignedContent.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                Belum ada konten yang ditugaskan.
                            </TableCell>
                        </TableRow>
                    )}
                    {assignedContent.map((item) => (
                        // --- PERBAIKAN: Gunakan group_content_id sebagai key unik ---
                        <TableRow key={item.group_content_id} className="hover:bg-muted/20">
                        {/* -------------------------------------------------------- */}
                            <TableCell className="px-3 py-2">
                                <div className="flex items-center justify-center w-6 h-6">
                                    {getIcon(item.content_type)}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium py-2">{getTitle(item)}</TableCell>
                            <TableCell className="text-right px-3 py-2">
                                <AlertDialog onOpenChange={(open) => !open && !isPending && setItemToDelete(null)}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => setItemToDelete(item)}
                                            disabled={isPending && itemToDelete?.group_content_id === item.group_content_id}
                                        >
                                           {(isPending && itemToDelete?.group_content_id === item.group_content_id)
                                                ? <Loader2 className="w-4 h-4 animate-spin"/>
                                                : <Trash2 className="w-4 h-4" />
                                            }
                                        </Button>
                                    </AlertDialogTrigger>
                                     <AlertDialogContent>
                                         <AlertDialogHeader>
                                             <AlertDialogTitle>Hapus Konten dari Grup?</AlertDialogTitle>
                                             <AlertDialogDescription>
                                                 Anda yakin ingin menghapus konten <span className="font-semibold">{getTitle(item)}</span> dari grup ini?
                                             </AlertDialogDescription>
                                         </AlertDialogHeader>
                                         <AlertDialogFooter>
                                             <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                                             <AlertDialogAction onClick={() => handleDelete(item)} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                                                 {isPending ? "Menghapus..." : "Ya, Hapus"}
                                             </AlertDialogAction>
                                         </AlertDialogFooter>
                                     </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}