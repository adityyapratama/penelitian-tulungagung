"use client";

import type { Puzzle } from "@/lib/generated/prisma";
import type React from "react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { UpdatePuzzle, type PuzzleFormState } from "../lib/actions";
import PuzzleDemo from "./puzzle-demo";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CircleAlert, Puzzle as PuzzleIcon, ImageIcon, Tag, Star, UploadCloud, Eye, EyeOff, Play } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="min-w-[140px]">
            {pending ? "Mengupdate..." : "Update Puzzle"}
        </Button>
    );
}

interface EditPuzzleFormProps {
    puzzle: Puzzle;
}

export default function EditPuzzleForm({ puzzle }: EditPuzzleFormProps) {
    const router = useRouter();
    const initialState: PuzzleFormState = {};
    const updatePuzzleWithId = UpdatePuzzle.bind(null, String(puzzle.puzzle_id));
    const [state, formAction] = useActionState(updatePuzzleWithId, initialState);
    
    const [imagePreview, setImagePreview] = useState<string | null>(puzzle.gambar);
    const [isPublished, setIsPublished] = useState<boolean>(puzzle.is_published);
    const [showPuzzleDemo, setShowPuzzleDemo] = useState(false);

    useEffect(() => {
        if (state?.success) {
            toast.success("Puzzle berhasil diupdate!");
            setTimeout(() => {
                router.push("/admin/dashboard/manage-puzzles");
                router.refresh(); 
            }, 1500);
        }
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(puzzle.gambar);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <div className="w-full border-0 max-w-5xl">
                        <form action={formAction}>
                            <CardHeader className="pb-6">
                                <CardTitle className="text-2xl font-bold">Edit Puzzle</CardTitle>
                                <CardDescription className="text-base">
                                    Update informasi puzzle. Kosongkan input gambar jika tidak ingin mengubahnya.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {state.message && !state.errors && (
                                     <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                                        <CircleAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Terjadi Kesalahan</p>
                                            <p className="text-sm mt-1">{state.message}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="judul" className="text-sm font-medium flex items-center gap-2">
                                            <PuzzleIcon className="w-4 h-4" /> Judul Puzzle
                                        </Label>
                                        <Input
                                            id="judul"
                                            name="judul"
                                            placeholder="Masukkan judul puzzle"
                                            defaultValue={puzzle.judul}
                                            className="h-11"
                                        />
                                        {state.errors?.judul && (
                                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                                                <CircleAlert className="w-4 h-4" /> {state.errors.judul[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Gambar Puzzle
                                        </Label>
                                        <Label
                                            htmlFor="gambar"
                                            className="relative w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                        >
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Preview Puzzle" fill className="object-contain" />
                                            ) : (
                                                <div className="text-center text-muted-foreground">
                                                    <UploadCloud className="mx-auto h-10 w-10 mb-2" />
                                                    <p className="text-sm font-bold">Klik untuk mengganti gambar</p>
                                                    <p className="text-xs">SVG, PNG, JPG or GIF (maks. 5MB)</p>
                                                </div>
                                            )}
                                        </Label>
                                        <Input
                                            id="gambar"
                                            name="gambar"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleImageChange}
                                        />
                                        {state.errors?.gambar && (
                                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                                                <CircleAlert className="w-4 h-4" /> {state.errors.gambar[0]}
                                            </p>
                                        )}
                                        {imagePreview && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowPuzzleDemo(true)}
                                                className="w-full"
                                            >
                                                <Play className="w-4 h-4 mr-2" />
                                                Demo Puzzle
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="kategori" className="text-sm font-medium flex items-center gap-2">
                                            <Tag className="w-4 h-4" /> Kategori
                                        </Label>
                                        <Select name="kategori" defaultValue={puzzle.kategori}>
                                            <SelectTrigger id="kategori" className="h-11">
                                                <SelectValue placeholder="Pilih kategori puzzle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Tempat_Wisata">Tempat Wisata</SelectItem>
                                                <SelectItem value="Tokoh_Sejarah">Tokoh Sejarah</SelectItem>
                                                <SelectItem value="Peta">Peta</SelectItem>
                                                <SelectItem value="Budaya">Budaya</SelectItem>
                                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {state.errors?.kategori && (
                                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                                                <CircleAlert className="w-4 h-4" /> {state.errors.kategori[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="xp_reward" className="text-sm font-medium flex items-center gap-2">
                                            <Star className="w-4 h-4" /> XP Reward
                                        </Label>
                                        <Input
                                            id="xp_reward"
                                            name="xp_reward"
                                            type="number"
                                            min="1" max="1000"
                                            placeholder="Masukkan jumlah XP"
                                            defaultValue={puzzle.xp_reward}
                                            className="h-11"
                                        />
                                        {state.errors?.xp_reward && (
                                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                                                <CircleAlert className="w-4 h-4" /> {state.errors.xp_reward[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            Status Publikasi
                                        </Label>
                                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md border">
                                            <Switch
                                                id="is_published_switch"
                                                name="is_published"
                                                value={isPublished ? "1" : "0"}
                                                checked={isPublished}
                                                onCheckedChange={setIsPublished}
                                            />
                                            <Label htmlFor="is_published_switch" className="cursor-pointer">
                                                {isPublished ? "Puzzle akan ditampilkan untuk umum." : "Puzzle disimpan sebagai draf."}
                                            </Label>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between pt-6 bg-slate-50/50 dark:bg-slate-800/50">
                                <Button variant="outline" asChild className="min-w-[120px] bg-transparent">
                                    <Link href="/admin/dashboard/manage-puzzles">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Batal
                                    </Link>
                                </Button>
                                <SubmitButton />
                            </CardFooter>
                        </form>
                    </div>
                </div>
            </div>
            
            {showPuzzleDemo && imagePreview && (
                <PuzzleDemo imageUrl={imagePreview} onClose={() => setShowPuzzleDemo(false)} />
            )}
        </div>
    );
}