"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, School, User, Flame, Trophy, Zap } from "lucide-react";

const Profile = () => {
  const memberData = {
    member_id: 1,
    user_id: 123,
    sekolah_id: 5,
    nis: "2024001",
    total_xp: 1250,
    level: 12,
    foto_profil: null,
    bio: "Passionate learner on a journey to master new skills every day!",
    tanggal_lahir: "2005-03-15",
    jenis_kelamin: "Laki-laki",
    minat: "Mathematics, Science, Technology",
    last_active: "2025-10-16T14:30:00",
    nama: "Ahmad Rizki",
    streak: 7
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Card */}
        <Card className="mb-6 border-primary/20 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                <AvatarImage src={memberData.foto_profil || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-3xl">
                  {memberData.nama.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {memberData.nama}
                </h1>
                <p className="text-muted-foreground mb-4">{memberData.bio}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Trophy className="h-4 w-4" />
                    Level {memberData.level}
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                    {memberData.streak} Day Streak
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    {memberData.total_xp} XP
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Stats Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-muted-foreground">Total XP</span>
                </div>
                <span className="font-bold text-primary text-lg">{memberData.total_xp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Level</span>
                </div>
                <span className="font-bold text-lg">{memberData.level}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-muted-foreground">Streak</span>
                </div>
                <span className="font-bold text-lg">{memberData.streak} days</span>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium">{memberData.jenis_kelamin}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Birth Date</span>
                <span className="font-medium">
                  {new Date(memberData.tanggal_lahir).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">NIS</span>
                <span className="font-mono text-sm">{memberData.nis}</span>
              </div>
            </CardContent>
          </Card>

          {/* School Info Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                School
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">School ID</span>
                <span className="font-medium">{memberData.sekolah_id}</span>
              </div>
            </CardContent>
          </Card>

          {/* Interests Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground block mb-3 font-medium">Interests</span>
                <div className="flex flex-wrap gap-2">
                  {memberData.minat.split(',').map((interest, idx) => (
                    <Badge key={idx} variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      {interest.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Last Active</span>
                <span className="text-sm font-medium">
                  {new Date(memberData.last_active).toLocaleString('id-ID')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;