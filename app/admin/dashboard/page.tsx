import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Puzzle,
  MessageSquare,
  BookOpen,
  School,
  FileText,
} from "lucide-react";
import { OverviewChart } from "./_components/OverviewChart";
import { RecentActivities } from "./_components/RecentActivities";
import prisma from "@/lib/prisma";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const [
    userCount,
    sekolahCount,
    artikelCount,
    puzzleCount,
    kuisCount,
    ceritaCount,
    recentActivitiesData,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.sekolah.count(),
    prisma.artikel.count(),
    prisma.puzzle.count(),
    prisma.kuis.count(),
    prisma.ceritaInteraktif.count(),
    prisma.memberActivityLog.findMany({
      take: 5,
      orderBy: { timestamp: "desc" },
      include: {
        Member: { include: { User: { select: { username: true } } } },
      },
    }),
  ]);

  const chartData = [
    { name: "Total Pengguna", total: userCount },
    { name: "Sekolah", total: sekolahCount },
    { name: "Artikel", total: artikelCount },
    { name: "Puzzle", total: puzzleCount },
    { name: "Kuis", total: kuisCount },
    { name: "Cerita", total: ceritaCount },
  ];

  const formattedActivities = (recentActivitiesData as any[]).map((log) => ({
    user: log.Member?.User?.username ?? "Member",
    action: log.activity_type.replace(/_/g, " "),
    target: log.description ?? "",
  }));

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Ringkasan</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard
          title="Total Pengguna"
          value={userCount.toLocaleString("id-ID")}
          icon={Users}
        />
        <StatCard
          title="Total Sekolah"
          value={sekolahCount.toLocaleString("id-ID")}
          icon={School}
        />
        <StatCard
          title="Total Artikel"
          value={artikelCount.toLocaleString("id-ID")}
          icon={FileText}
        />
        <StatCard
          title="Total Puzzle"
          value={puzzleCount.toLocaleString("id-ID")}
          icon={Puzzle}
        />
        <StatCard
          title="Total Kuis"
          value={kuisCount.toLocaleString("id-ID")}
          icon={MessageSquare}
        />
        <StatCard
          title="Total Cerita"
          value={ceritaCount.toLocaleString("id-ID")}
          icon={BookOpen}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Distribusi Konten & Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivities activities={formattedActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
