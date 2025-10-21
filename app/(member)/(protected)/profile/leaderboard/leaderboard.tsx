"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GetLeaderboard } from "@/app/(member)/lib/actions";

type LeaderboardPlayer = {
  member_id: number | null;
  skor: number | null;
  duration: number | null;
  Member: {
    member_id: number;
    foto_profil: string | null;
    User: {
      username: string;
    } | null;
  } | null;
};

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const leaderboard = await GetLeaderboard();
      setLeaderboardData(leaderboard);
      setLoading(false);
    };

    fetchData();
  }, []);
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
      default:
        return <span className="font-bold text-lg text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Top players by XP points</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Main Leaderboard */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Top Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leaderboard data available yet
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {leaderboardData.map((player, idx) => {
                      const rank = idx + 1;
                      const username = player.Member?.User?.username || "Unknown";
                      const skor = player.skor || 0;
                      const avatar = player.Member?.foto_profil || "";

                      return (
                        <div
                          key={`leaderboard-${player.member_id}-${idx}`}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]",
                            rank <= 3 
                              ? "bg-gradient-to-r from-primary/10 to-transparent border border-primary/20" 
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          {/* Rank Icon */}
                          <div className="w-10 flex justify-center items-center">
                            {getRankIcon(rank)}
                          </div>
                          
                          {/* Avatar */}
                          <Avatar className={cn(
                            "h-14 w-14 border-2",
                            rank === 1 && "border-yellow-500",
                            rank === 2 && "border-gray-400",
                            rank === 3 && "border-amber-600"
                          )}>
                            <AvatarImage src={avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                              {username.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg truncate">{username}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="gap-1">
                                <Trophy className="h-3 w-3" />
                                Score: {skor}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* XP Badge */}
                          <div className="text-right">
                            <Badge 
                              className={cn(
                                "font-mono text-sm px-3 py-1",
                                getRankBadgeColor(rank)
                              )}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              {skor.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats & Info Sidebar */}
          <div className="space-y-6">
            {/* Your Rank Card - COMMENTED OUT */}
            {/* 
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Your Rank</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-muted-foreground py-4">
                  Feature coming soon!
                </div>
              </CardContent>
            </Card>
            */}

            {/* Top 3 Podium */}
            {leaderboardData.length >= 3 && (
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Hall of Fame
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-center gap-4">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                      <Avatar className="h-12 w-12 mb-2 border-2 border-gray-400">
                        <AvatarImage src={leaderboardData[1]?.Member?.foto_profil || ""} />
                        <AvatarFallback className="bg-gray-400 text-white">
                          {(leaderboardData[1]?.Member?.User?.username || "?").split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-b from-gray-400 to-gray-500 text-white rounded-t-lg px-4 py-6 text-center w-20">
                        <Trophy className="h-5 w-5 mx-auto mb-1 fill-white" />
                        <p className="text-xs font-medium">2nd</p>
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center -mt-4">
                      <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500 mb-1 animate-pulse" />
                      <Avatar className="h-16 w-16 mb-2 border-4 border-yellow-500 shadow-lg">
                        <AvatarImage src={leaderboardData[0]?.Member?.foto_profil || ""} />
                        <AvatarFallback className="bg-yellow-500 text-white text-xl">
                          {(leaderboardData[0]?.Member?.User?.username || "?").split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 text-white rounded-t-lg px-4 py-8 text-center w-24">
                        <Trophy className="h-6 w-6 mx-auto mb-1 fill-white" />
                        <p className="text-sm font-bold">1st</p>
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                      <Avatar className="h-12 w-12 mb-2 border-2 border-amber-600">
                        <AvatarImage src={leaderboardData[2]?.Member?.foto_profil || ""} />
                        <AvatarFallback className="bg-amber-600 text-white">
                          {(leaderboardData[2]?.Member?.User?.username || "?").split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-b from-amber-600 to-amber-700 text-white rounded-t-lg px-4 py-6 text-center w-20">
                        <Medal className="h-5 w-5 mx-auto mb-1 fill-white" />
                        <p className="text-xs font-medium">3rd</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;