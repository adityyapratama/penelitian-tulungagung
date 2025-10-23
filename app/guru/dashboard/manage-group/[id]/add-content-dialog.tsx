"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { getAvailableQuizzesForGroup, getAvailableStoriesForGroup, getAvailablePuzzlesForGroup } from "../lib/data";
import { CreateGroupContent, ContentActionResult } from "../../../lib/actions"; // Path ../lib/actions
import { useRouter } from "next/navigation";

type ContentTypeEnum = 'kuis' | 'cerita' | 'puzzle';

type AvailableContentItem = {
    id: number;
    judul: string;
};

type ContentSelection = {
    content_type: ContentTypeEnum;
    content_id: number;
};

interface AddContentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    guruId: number;
}

export function AddContentDialog({ isOpen, onClose, groupId, guruId }: AddContentDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<ContentTypeEnum>('kuis');
    const [availableContent, setAvailableContent] = useState<Record<ContentTypeEnum, AvailableContentItem[]>>({
        kuis: [], cerita: [], puzzle: []
    });
    const [loadingContent, setLoadingContent] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContent, setSelectedContent] = useState<ContentSelection[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!isOpen) {
            setSelectedContent([]);
            setSearchTerm("");
            // Reset state available content saat ditutup agar fetch ulang
            setAvailableContent({ kuis: [], cerita: [], puzzle: [] }); 
            return;
        };

        const fetchContent = async () => {
            // --- PERBAIKAN: Hapus pengecekan data stale ---
            // if (availableContent[activeTab].length > 0 && searchTerm === "") {
            //      setLoadingContent(false);
            //      return;
            // }
            // -------------------------------------------
            
            setLoadingContent(true);
            // Hapus data tab saat ini untuk fetch ulang
            setAvailableContent(prev => ({ ...prev, [activeTab]: [] })); 
            try {
                let contentResult: AvailableContentItem[] | { error: string } = [];
                // Panggil dengan 2 argumen
                if (activeTab === 'kuis') contentResult = await getAvailableQuizzesForGroup(groupId, guruId);
                else if (activeTab === 'cerita') contentResult = await getAvailableStoriesForGroup(groupId, guruId);
                else if (activeTab === 'puzzle') contentResult = await getAvailablePuzzlesForGroup(groupId, guruId);

                if(Array.isArray(contentResult)) {
                    setAvailableContent(prev => ({ ...prev, [activeTab]: contentResult }));
                } else {
                     toast.error(`Gagal memuat ${activeTab}`, { description: contentResult.error });
                     setAvailableContent(prev => ({ ...prev, [activeTab]: [] }));
                }
            } catch (error) {
                console.error(`Error fetching available ${activeTab}:`, error);
                toast.error(`Gagal memuat daftar ${activeTab}.`);
                 setAvailableContent(prev => ({ ...prev, [activeTab]: [] }));
            } finally {
                setLoadingContent(false);
            }
        };
        fetchContent();
    }, [isOpen, activeTab, groupId, guruId]);

    const handleCheckboxChange = (checked: boolean | 'indeterminate', type: ContentTypeEnum, id: number) => {
        const item: ContentSelection = { content_type: type, content_id: id };
        if (checked === true) {
            setSelectedContent(prev => [...prev, item]);
        } else {
            setSelectedContent(prev => prev.filter(sel => !(sel.content_type === type && sel.content_id === id)));
        }
    };

    const isSelected = (type: ContentTypeEnum, id: number) => {
        return selectedContent.some(sel => sel.content_type === type && sel.content_id === id);
    };

    const getIdForItem = (item: AvailableContentItem): number => {
        return item.id;
    };

    const filteredContent = (availableContent[activeTab] || []).filter(item =>
        item.judul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveSelection = () => {
        if (selectedContent.length === 0) {
            toast.warning("Tidak ada konten yang dipilih.");
            return;
        }
        startTransition(async () => {
             const payload = { groupId: groupId, contents: selectedContent };
             const result: ContentActionResult = await CreateGroupContent(payload);

             if (result.success) {
                 toast.success(result.success);
                 onClose();
                 router.refresh();
             } else {
                 toast.error("Gagal Menambahkan", { description: result.error || "Terjadi kesalahan." });
             }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Tambah Konten ke Grup</DialogTitle>
                    <DialogDescription>
                        Pilih Kuis, Cerita, atau Puzzle yang ingin ditugaskan ke grup ini.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentTypeEnum)} className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="kuis">Kuis</TabsTrigger>
                        <TabsTrigger value="cerita">Cerita</TabsTrigger>
                        <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
                    </TabsList>

                    <TabsContent value="kuis" className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Cari kuis...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>
                        <div className="h-[300px] overflow-y-auto border rounded-md relative">
                            {loadingContent && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary"/>
                                </div>
                            )}
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 z-0">
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Judul</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredContent.length === 0 && !loadingContent && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                                Tidak ada kuis tersedia atau cocok.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredContent.map((item) => {
                                        const itemId = getIdForItem(item);
                                        return (
                                            <TableRow key={itemId} data-state={isSelected('kuis', itemId) ? "selected" : undefined}>
                                                <TableCell className="p-2">
                                                    <Checkbox
                                                        id={`kuis-${itemId}`}
                                                        checked={isSelected('kuis', itemId)}
                                                        onCheckedChange={(checked) => handleCheckboxChange(checked, 'kuis', itemId)}
                                                        aria-label={`Select ${item.judul}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Label htmlFor={`kuis-${itemId}`} className="cursor-pointer font-medium">
                                                        {item.judul}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="cerita" className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Cari cerita...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>
                        <div className="h-[300px] overflow-y-auto border rounded-md relative">
                            {loadingContent && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary"/>
                                </div>
                            )}
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 z-0">
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Judul</TableHead>
                                    </TableRow>
                                </TableHeader>
                                 <TableBody>
                                    {filteredContent.length === 0 && !loadingContent && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                                Tidak ada cerita tersedia atau cocok.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredContent.map((item) => {
                                        const itemId = getIdForItem(item);
                                        return (
                                            <TableRow key={itemId} data-state={isSelected('cerita', itemId) ? "selected" : undefined}>
                                                <TableCell className="p-2">
                                                    <Checkbox
                                                        id={`cerita-${itemId}`}
                                                        checked={isSelected('cerita', itemId)}
                                                        onCheckedChange={(checked) => handleCheckboxChange(checked, 'cerita', itemId)}
                                                        aria-label={`Select ${item.judul}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Label htmlFor={`cerita-${itemId}`} className="cursor-pointer font-medium">
                                                        {item.judul}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="puzzle" className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Cari puzzle...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>
                        <div className="h-[300px] overflow-y-auto border rounded-md relative">
                            {loadingContent && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary"/>
                                </div>
                            )}
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 z-0">
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Judul</TableHead>
                                    </TableRow>
                                </TableHeader>
                                 <TableBody>
                                    {filteredContent.length === 0 && !loadingContent && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                                Tidak ada puzzle tersedia atau cocok.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredContent.map((item) => {
                                        const itemId = getIdForItem(item);
                                        return (
                                            <TableRow key={itemId} data-state={isSelected('puzzle', itemId) ? "selected" : undefined}>
                                                <TableCell className="p-2">
                                                    <Checkbox
                                                        id={`puzzle-${itemId}`}
                                                        checked={isSelected('puzzle', itemId)}
                                                        onCheckedChange={(checked) => handleCheckboxChange(checked, 'puzzle', itemId)}
                                                        aria-label={`Select ${item.judul}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Label htmlFor={`puzzle-${itemId}`} className="cursor-pointer font-medium">
                                                        {item.judul}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSaveSelection} disabled={isPending || selectedContent.length === 0}>
                         {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Plus className="w-4 h-4 mr-2" />}
                        Tambahkan ({selectedContent.length}) Konten
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}