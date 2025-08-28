"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, BookOpen, ListChecks } from "lucide-react";
import { UpdateQuiz } from "@/app/admin/dashboard/manage-quiz/lib/actions";
import type { Kuis, KategoriKuis } from "@prisma/client";


// Tombol submit bisa diubah teksnya
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin" />
          Menyimpan...
        </>
      ) : (
        "Simpan Perubahan"
      )}
    </Button>
  );
}

// 2. UBAH: Definisikan props untuk menerima data kuis dan kategori
interface EditQuizFormProps {
    quiz: Kuis;
    categories: KategoriKuis[];
}

export function EditQuizForm({ quiz, categories }: EditQuizFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  // 3. UBAH: handleSubmit sekarang memanggil UpdateQuiz dengan ID
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(false);
    try {
      // Panggil UpdateQuiz dengan ID kuis dan formData
      const result = await UpdateQuiz(quiz.kuis_id.toString(), formData);
      
      if (result?.error) {
        setError(typeof result.error === 'string' ? result.error : "Terjadi kesalahan.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          // Refresh halaman untuk melihat data terbaru
          router.push('/admin/dashboard/manage-quiz/quiz');
        }, 1500);
      }
    } catch {
      setError("Terjadi kesalahan saat memperbarui kuis");
    }
  };

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle>Detail Kuis</CardTitle>
        <CardDescription>Ubah informasi kuis Anda di bawah ini</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {success && <p className="text-sm font-medium text-green-600">Kuis berhasil diperbarui!</p>}

          {/* 4. UBAH: Tambahkan 'defaultValue' ke setiap input */}
          <div className="space-y-2">
            <Label htmlFor="judul">Judul Kuis</Label>
            <Input id="judul" name="judul" defaultValue={quiz.judul} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea id="deskripsi" name="deskripsi" defaultValue={quiz.deskripsi || ""} required rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori_id">Kategori</Label>
            <select id="kategori_id" name="kategori_id" defaultValue={quiz.kategori_id?.toString()} className="w-full p-2 border rounded-md" required>
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.kategori_id} value={cat.kategori_id}>
                  {cat.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="xp_reward">XP Reward</Label>
            <Input id="xp_reward" name="xp_reward" type="number" defaultValue={quiz.xp_reward} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_published">Publikasikan?</Label>
            <select id="is_published" name="is_published" defaultValue={quiz.is_published ? "true" : "false"} className="w-full p-2 border rounded-md" required>
              <option value="1">Ya</option>
              <option value="0">Tidak</option>
            </select>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}