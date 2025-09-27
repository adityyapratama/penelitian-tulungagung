import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";

type LeaderboardData = {
  member_id: number | null;
  skor: number;
  duration: number;
  ratio: number;
}[];

export function Leaderboard({ data }: { data: LeaderboardData }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className=" text-center text-muted-foreground">
          Belum ada yang menyelesaikan. Jadilah yang pertama!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold w-6 text-center text-lg">{index + 1}</span>
              <UserCircle2 className="h-9 w-9 text-muted-foreground" />
              <span className="font-medium text-sm">
                Pemain #{entry.member_id || 'N/A'}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{entry.skor} pts</p>
              <p className="text-xs text-muted-foreground">{entry.duration} detik</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}