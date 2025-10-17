"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, ChevronRight, Crown, Zap, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, name: "Ahmad Rizki", xp: 15420, avatar: "", level: 28, streak: 15 },
  { rank: 2, name: "Siti Nurhaliza", xp: 14890, avatar: "", level: 27, streak: 12 },
  { rank: 3, name: "Budi Santoso", xp: 13750, avatar: "", level: 26, streak: 10 },
  { rank: 4, name: "Dewi Lestari", xp: 12340, avatar: "", level: 25, streak: 8 },
  { rank: 5, name: "Eko Prasetyo", xp: 11890, avatar: "", level: 24, streak: 7 },
  { rank: 6, name: "Rani Permata", xp: 10500, avatar: "", level: 23, streak: 6 },
  { rank: 7, name: "Fadli Rahman", xp: 9800, avatar: "", level: 22, streak: 5 },
  { rank: 8, name: "Maya Sari", xp: 8900, avatar: "", level: 21, streak: 4 },
];

const Leaderboard = () => {
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
              <div className="space-y-3">
                {leaderboardData.map((player, idx) => (
                  <div
                    key={player.rank}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]",
                      player.rank <= 3 
                        ? "bg-gradient-to-r from-primary/10 to-transparent border border-primary/20" 
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    {/* Rank Icon */}
                    <div className="w-10 flex justify-center items-center">
                      {getRankIcon(player.rank)}
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className={cn(
                      "h-14 w-14 border-2",
                      player.rank === 1 && "border-yellow-500",
                      player.rank === 2 && "border-gray-400",
                      player.rank === 3 && "border-amber-600"
                    )}>
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg truncate">{player.name}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="gap-1">
                          <Trophy className="h-3 w-3" />
                          Level {player.level}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {player.streak} days
                        </Badge>
                      </div>
                    </div>
                    
                    {/* XP Badge */}
                    <div className="text-right">
                      <Badge 
                        className={cn(
                          "font-mono text-sm px-3 py-1",
                          getRankBadgeColor(player.rank)
                        )}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {player.xp.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-1 transition-colors p-2 rounded-lg hover:bg-primary/10">
                View Full Leaderboard
                <ChevronRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>

          {/* Stats & Info Sidebar */}
          <div className="space-y-6">
            {/* Your Rank Card */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Your Rank</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-3">
                    <span className="text-3xl font-bold">#15</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Your XP</p>
                    <p className="text-2xl font-bold text-primary">1,250</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Level</p>
                      <p className="text-lg font-bold">12</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Streak</p>
                      <p className="text-lg font-bold">7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top 3 Podium */}
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
                      <AvatarImage src={leaderboardData[1].avatar} />
                      <AvatarFallback className="bg-gray-400 text-white">
                        {leaderboardData[1].name.split(' ').map(n => n[0]).join('')}
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
                      <AvatarImage src={leaderboardData[0].avatar} />
                      <AvatarFallback className="bg-yellow-500 text-white text-xl">
                        {leaderboardData[0].name.split(' ').map(n => n[0]).join('')}
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
                      <AvatarImage src={leaderboardData[2].avatar} />
                      <AvatarFallback className="bg-amber-600 text-white">
                        {leaderboardData[2].name.split(' ').map(n => n[0]).join('')}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;