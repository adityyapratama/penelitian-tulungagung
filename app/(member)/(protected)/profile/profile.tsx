"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, School, User, Flame, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import {
  GetMemberData,
  GetExpMember,
} from "@/app/(member)/lib/actions"; 
import { Skeleton } from "@/components/ui/skeleton";


type MemberData = {
  member_id: number;
  user_id: number;
  sekolah_id: number;
  nis: string | null;
  level: number;
  foto_profil: string | null;
  bio: string | null;
  tanggal_lahir: Date | string | null; 
  jenis_kelamin: string | null;
  minat: string | null;
  Sekolah?: {
    nama_sekolah: string | null;
  } | null;
  User?: {
    username: string;
    email: string;
  } | null;
};


const Profile = () => {
  
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  
  const [totalXp, setTotalXp] = useState<number>(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

    
      const memberResult = await GetMemberData();

      
      if (!memberResult) {
        setError("Data member tidak ditemukan");
        setLoading(false);
        return;
      }

      
      if ('error' in memberResult) {
        setError(memberResult.error);
        setLoading(false);
        return; 
      }

      
      const data = {
        ...memberResult,
        tanggal_lahir: memberResult.tanggal_lahir
          ? new Date(memberResult.tanggal_lahir)
          : null,
      } as MemberData;
      
      setMemberData(data);

      
      if (data.member_id) {
        const xp = await GetExpMember(String(data.member_id));
        setTotalXp(xp || 0); 
      }

      setLoading(false);
    };

    fetchData();
  }, []); // [] berarti useEffect ini hanya jalan sekali saat komponen dimuat

  
  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  
  if (error || !memberData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center text-red-500">
        <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
        <p>{error || "Gagal memuat data profil."}</p>
      </div>
    );
  }

  // Ambil data dari memberData
  const nama = memberData.User?.username || "Siswa";
  const streak = 0; // 'streak' tidak dihitung
  const lastActive = null; // 'last_active' tidak ada di GetMemberData
  const avatarFallback = nama.split(' ').map(n => n[0]).join('');

  
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
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {nama} {/* Menggunakan nilai placeholder */}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {memberData.bio || "Bio belum diatur."}
                </p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Trophy className="h-4 w-4" />
                    Level {memberData.level} {/* Dari memberData */}
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {streak} Day Streak {/* Menggunakan nilai placeholder */}
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    {totalXp} XP {/* Dari state totalXp */}
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
                <span className="font-bold text-primary text-lg">
                  {totalXp.toLocaleString()} {/* Dari state totalXp */}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Level</span>
                </div>
                <span className="font-bold text-lg">
                  {memberData.level} {/* Dari memberData */}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-muted-foreground">Streak</span>
                </div>
                <span className="font-bold text-lg">
                  {streak} days {/* Menggunakan nilai placeholder */}
                </span>
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
                <span className="font-medium">
                  {memberData.jenis_kelamin || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Tanggal Lahir</span>
                <span className="font-medium">
                  {memberData.tanggal_lahir
                    ? new Date(memberData.tanggal_lahir).toLocaleDateString("id-ID")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">NIS</span>
                <span className="font-mono text-sm">{memberData.nis || "-"}</span>
              </div>
            </CardContent>
          </Card>

          {/* School Info Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{memberData.User?.email || "Tidak ada data"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Nama Sekolah</span>
                <span className="font-medium">{memberData.Sekolah?.nama_sekolah || "Tidak ada data"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Sekolah ID</span>
                <span className="font-medium">{memberData.sekolah_id}</span>
              </div>
            </CardContent>
          </Card>

          {/* Interests Card */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground block mb-3 font-medium">
                  Interests
                </span>
                <div className="flex flex-wrap gap-2">
                  {memberData.minat ? (
                    memberData.minat.split(",").map((interest, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {interest.trim()}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Minat belum diatur.
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Last Active</span>
                <span className="text-sm font-medium">
                  {/* 'lastActive' tidak ada, jadi kita tampilkan placeholder */}
                  {lastActive
                    ? new Date(lastActive).toLocaleString("id-ID")
                    : "Tidak diketahui"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Komponen Skeleton untuk UI Loading
const ProfileLoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-3 text-center md:text-left">
            <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-full max-w-md mx-auto md:mx-0" />
            <div className="flex gap-2 justify-center md:justify-start">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Profile;