"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AssignedGameCard, MemberGroup } from "./lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Play, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GroupAssignmentClientProps {
  allMemberGroups: MemberGroup[];
  assignedContent: AssignedGameCard[];
  selectedGroupId?: string;
  contentError: string | null;
}

export function GroupAssignmentClient({
  allMemberGroups,
  assignedContent,
  selectedGroupId,
  contentError,
}: GroupAssignmentClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  const handleGroupChange = (groupId: string) => {
    const params = new URLSearchParams();
    params.set("group_id", groupId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const getGameUrl = (game: AssignedGameCard) => {
    const id = game.id.split("-")[1];
    let baseUrl = "";
    if (game.type === "kuis") baseUrl = `/games/quiz/${id}`;
    else if (game.type === "cerita") baseUrl = `/games/cerita/${id}`;
    else baseUrl = `/games/puzzle/${id}`;

    return `${baseUrl}?group_id=${game.groupId}`;
  };

  return (
    <div className="space-y-8">
      {/* Dropdown Pemilih Grup */}
      <div>
        <Label htmlFor="group-select" className="text-lg font-semibold">
          Pilih Grup
        </Label>
        <Select
          onValueChange={handleGroupChange}
          defaultValue={selectedGroupId}
        >
          <SelectTrigger
            id="group-select"
            className="w-full max-w-sm mt-2 h-11 text-base"
          >
            <SelectValue placeholder="Pilih grup untuk melihat tugas..." />
          </SelectTrigger>
          <SelectContent>
            {allMemberGroups.length === 0 && (
              <SelectItem value="no-group" disabled>
                Anda belum bergabung di grup manapun.
              </SelectItem>
            )}
            {allMemberGroups.map((group) => (
              <SelectItem
                key={group.group_id}
                value={group.group_id}
                className="py-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-6 h-6">
                    {group.group_thumbnail ? (
                      <AvatarImage
                        src={group.group_thumbnail}
                        alt={group.group_name || "G"}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        <Users className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{group.group_name || "Grup Tanpa Nama"}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kontainer Konten (Game Cards) */}
      <div>
        {!selectedGroupId && (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg border-border bg-muted/50">
            <p className="text-lg text-muted-foreground">
              Silakan pilih grup di atas.
            </p>
          </div>
        )}

        {contentError && (
          <Alert variant="destructive" className="max-w-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Gagal Memuat Konten</AlertTitle>
            <AlertDescription>{contentError}</AlertDescription>
          </Alert>
        )}

        {selectedGroupId && !contentError && assignedContent.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg border-border bg-muted/50">
            <p className="text-lg text-muted-foreground">
              Tidak ada tugas yang ditemukan untuk grup ini.
            </p>
          </div>
        )}

        {selectedGroupId && !contentError && assignedContent.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {assignedContent.map((game, index) => {
              const GameButton = (
                <Button
                  size="sm"
                  className="w-full gap-1 transition-all duration-300 text-xs h-8 text-white shadow-lg"
                  style={{
                    backgroundColor: "#2957A4",
                    boxShadow: `0 4px 12px #2957A440`,
                  }}
                >
                  <Play className="w-3 h-3" />
                  Mainkan
                </Button>
              );

              return (
                <Card
                  key={game.id}
                  className="relative flex flex-col pt-0 overflow-hidden transition-all duration-500 border-0 group hover:shadow-2xl hover:-translate-y-2 animate-bounce-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    boxShadow: "0 4px 20px rgba(41, 87, 164, 0.1)",
                  }}
                >
                  <div className="relative flex-shrink-0 w-full overflow-hidden rounded-t-lg h-42">
                    <Image
                      src={
                        game.image
                          ? game.image.startsWith("http")
                            ? game.image
                            : `/${game.image
                                .replace(/\\/g, "/")
                                .replace(/^\/+/, "")}`
                          : "/placeholder.svg"
                      }
                      alt={game.title}
                      fill
                    />
                    {/* <div
                                            className="absolute flex items-center px-2 py-1 text-xs font-bold rounded-full shadow-md top-2 right-2"
                                            style={{ backgroundColor: "#FFCC29", color: "#2957A4" }}
                                        >
                                            <Trophy className="w-3 h-3 mr-1" />
                                            {game.xp_reward}
                                        </div> */}
                  </div>

                  <div className="flex flex-col flex-grow p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {/* Game Type Badge (Left) */}
                      <Badge
                        variant="secondary"
                        className="capitalize text-xs px-2 py-0.5"
                      >
                        {game.type}
                      </Badge>
                      {/* Trophy Badge (Right) */}
                      <div
                        className="flex items-center px-2 py-0.5 text-xs font-bold rounded-full shadow-sm"
                        style={{ backgroundColor: "#FFCC29", color: "#2957A4" }}
                      >
                        <Trophy className="w-3 h-3 mr-1" />
                        {game.xp_reward}
                      </div>
                    </div>
                    <div className="flex-grow space-y-2">
                      <h3
                        className="text-sm font-semibold line-clamp-2"
                        style={{ color: "#2957A4" }}
                      >
                        {game.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="mr-2 font-medium truncate text-muted-foreground">
                        {game.category}
                      </span>
                    </div>

                    {status === "authenticated" ? (
                      <Link href={getGameUrl(game)}>{GameButton}</Link>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          {GameButton}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Anda Belum Login
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Untuk memainkan game, Anda perlu login terlebih
                              dahulu.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Nanti Saja</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => router.push("/sign-in")}
                            >
                              <LogIn className="w-4 h-4 mr-2" />
                              Login Sekarang
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
