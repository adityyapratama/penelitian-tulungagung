import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Puzzle, MessageSquare, BookOpen } from "lucide-react";
import { OverviewChart } from "./_components/OverviewChart";
import { RecentActivities } from "./_components/RecentActivities";

// Komponen kecil untuk kartu statistik
function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Ringkasan</h1>
      </div>

      {/* Bagian Kartu Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Member" value="1,245" icon={Users} />
        <StatCard title="Total Puzzle" value="53" icon={Puzzle} />
        <StatCard title="Total Kuis" value="31" icon={MessageSquare} />
        <StatCard title="Total Cerita" value="18" icon={BookOpen} />
      </div>

      {/* Bagian Chart dan Aktivitas Terbaru */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Distribusi Konten</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivities />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}