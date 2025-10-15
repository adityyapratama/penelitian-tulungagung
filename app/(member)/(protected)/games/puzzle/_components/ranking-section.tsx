import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateInitials } from "@/lib/utils";

type Ranking = {
  skor: number | null;
  duration: number;
  Member: {
    foto_profil: string | null;
    User: { username: string } | null;
  } | null;
};

export function RankingSection({ rankings }: { rankings: Ranking[] }) {
  if (!rankings || rankings.length === 0) {
    return (
      <Card className="w-full bg-card border-border shadow-lg p-0">
        <CardHeader className="p-6 pb-4 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold text-center">RANKING</CardTitle>
          </div>
          <p className="text-center text-primary-foreground/80 text-sm">Skor tertinggi minggu ini</p>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Belum ada yang bermain. Jadilah yang pertama!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card border-border shadow-lg p-0">
      <CardHeader className="p-6 pb-4 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" />
          <CardTitle className="text-2xl font-bold text-center">RANKING</CardTitle>
        </div>
        <p className="text-center text-primary-foreground/80 text-sm">Skor tertinggi minggu ini</p>
        <div className="text-xs text-primary-foreground/70 text-center mt-2">
          <p>Skor diurutkan berdasarkan poin tertinggi</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        {rankings.map((player, index) => {
          const rank = index + 1;
          const IconComponent = rank <= 3 ? [Trophy, Medal, Award][rank - 1] : null;
          const username = player.Member?.User?.username;
          
          return (
            <div
              key={rank}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {rank}
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={player.Member?.foto_profil || undefined} />
                  <AvatarFallback>{generateInitials(username)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-foreground">{username || "Pemain"}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-primary">{player.skor || 0} pts</span>
                    <span className="text-xs text-muted-foreground">({player.duration}s)</span>
                  </div>
                </div>
              </div>
              {IconComponent && <IconComponent className="w-5 h-5 text-yellow-500" />}
            </div>
          );
        })}

        <Button
          variant="ghost"
          className="w-full mt-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50"
        >
          Lihat Semua Peringkat
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}