// Lokasi: app/guru/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileQuestion, FileText, Puzzle, Users } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// --- 1. Impor komponen chart yang sudah ada ---
import { OverviewChart } from "./_components/OverviewChart";

// Komponen kartu statistik (tidak berubah)
function StatCard({
  title,
  value,
  icon: Icon,
  context,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  context: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{context}</p>
      </CardContent>
    </Card>
  );
}

// Halaman dashboard sekarang menjadi async untuk mengambil data
export default async function GuruDashboardPage() {
  const session = await auth();
  const userIdString = session?.user?.id;

  if (!userIdString) {
    return (
      <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Guru</h1>
        <p>Gagal memuat data pengguna. Silakan coba login kembali.</p>
      </div>
    );
  }

  // Ubah user ID dari string menjadi number
  const userId = parseInt(userIdString, 10);

  // Ambil data total untuk 5 manajemen (tidak berubah)
  const [artikelCount, kuisCount, ceritaCount, puzzleCount, grupCount] =
    await prisma.$transaction([
      prisma.artikel.count({ where: { created_by: userId } }),
      prisma.kuis.count({ where: { created_by: userId } }),
      prisma.ceritaInteraktif.count({ where: { created_by: userId } }),
      prisma.puzzle.count({ where: { created_by: userId } }),
      prisma.group.count({ where: { created_by: userId } }),
    ]);

  // --- 2. Siapkan data untuk chart (sama seperti sebelumnya) ---
  const chartData = [
    { name: "Artikel", total: artikelCount },
    { name: "Kuis", total: kuisCount },
    { name: "Cerita", total: ceritaCount },
    { name: "Puzzle", total: puzzleCount },
    { name: "Group", total: grupCount },
  ];

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Guru</h1>
      </div>

      <p>
        Selamat datang, {session.user.name || "Guru"}. Berikut adalah ringkasan
        aktivitas Anda.
      </p>

      {/* Tampilkan 5 kartu statistik dinamis (tidak berubah) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Artikel"
          value={artikelCount.toLocaleString("id-ID")}
          icon={FileText}
          context="Jumlah artikel yang telah Anda buat."
        />
        <StatCard
          title="Total Kuis"
          value={kuisCount.toLocaleString("id-ID")}
          icon={FileQuestion}
          context="Jumlah kuis yang telah Anda buat."
        />
        <StatCard
          title="Total Cerita"
          value={ceritaCount.toLocaleString("id-ID")}
          icon={BookOpen}
          context="Jumlah cerita yang telah Anda buat."
        />
        <StatCard
          title="Total Puzzle"
          value={puzzleCount.toLocaleString("id-ID")}
          icon={Puzzle}
          context="Jumlah puzzle yang telah Anda buat."
        />
        <StatCard
          title="Total Group"
          value={grupCount.toLocaleString("id-ID")}
          icon={Users}
          context="Jumlah grup yang telah Anda buat."
        />
      </div>

      {/* --- 3. Tambahkan Bar Chart Menggunakan Komponen Anda --- */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Konten Anda</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {/* Menggunakan komponen OverviewChart yang sudah ada */}
          <OverviewChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
