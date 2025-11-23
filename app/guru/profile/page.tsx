import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link"; // <--- [BARU] Import Link
import { GetGuruData, GetAllSekolah } from "../lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // <--- [BARU] Import Button
import { Mail, User, Building2, ArrowLeft } from "lucide-react"; // <--- [BARU] Tambah ArrowLeft
import { GuruProfileForm } from "../_components/guru-profile-form";

export default async function GuruProfilePage() {
  const session = await auth();
  if (!session) redirect("/");

  // 1. Ambil data Guru dan Daftar Sekolah secara paralel
  const [guruData, sekolahList] = await Promise.all([
    GetGuruData(),
    GetAllSekolah(),
  ]);

  // Handle error jika gagal fetch
  if ("error" in guruData) {
    return (
      <div className="p-8 text-center text-red-500">
        Gagal memuat profil: {guruData.error}
      </div>
    );
  }

  // Buat inisial nama
  const initials = guruData.username
    ? guruData.username.substring(0, 2).toUpperCase()
    : "GU";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto">
      
      {/* --- [BARU] BAGIAN NAVIGASI ATAS --- */}
      <div>
        <Button
          variant="ghost"
          asChild
          className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
        >
          <Link href="/guru/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground">
          Kelola informasi pribadi dan data pengajar Anda.
        </p>
      </div>
      {/* ----------------------------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI: Informasi Akun & Avatar (Tetap Server Rendered) */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="text-center">
            <div className="mx-auto w-32 h-32 relative mb-4">
              <Avatar className="w-full h-full border-4 border-primary/10">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={guruData.username}
                />
                <AvatarFallback className="text-4xl font-bold bg-primary/5 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{guruData.username}</CardTitle>
            <CardDescription>{guruData.email}</CardDescription>
            <div className="mt-4 flex justify-center">
              <Badge variant="secondary" className="px-4 py-1">
                Role: Guru / Pengajar
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="my-4" />
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Akun Aktif</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{guruData.email}</span>
              </div>
              {guruData.nama_sekolah && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{guruData.nama_sekolah}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KOLOM KANAN: Client Component Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data Pengajar</CardTitle>
            <CardDescription>
              Lengkapi data berikut untuk kebutuhan administrasi dan kelas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Panggil Client Component Disini */}
            <GuruProfileForm guruData={guruData} sekolahList={sekolahList} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}