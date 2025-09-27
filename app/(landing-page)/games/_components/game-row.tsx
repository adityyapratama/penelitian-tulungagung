"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Play, ArrowRight, Lock, CheckCircle, Puzzle, LogIn } from "lucide-react"
import type { GameCardData } from "../lib/data"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
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
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface GameRowProps {
  title: string
  description: string
  games: GameCardData[]
  href: string
}

export function GameRow({ title, description, games, href }: GameRowProps) {
  const { status } = useSession()
  const router = useRouter()

  const getGameUrl = (game: GameCardData) => {
    const id = game.id.split("-")[1]
    if (game.type === "kuis") return `/games/kuis/${id}`
    if (game.type === "cerita") return `/games/cerita/${id}`
    return `/games/puzzle/${id}`
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "puzzle": return "#F44336"
      case "kuis": return "#2957A4"
      case "cerita": return "#4CAF50"
      default: return "#2957A4"
    }
  }
  
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center animate-bounce-in shadow-lg"
              style={{
                backgroundColor: getBadgeColor(games[0]?.type || "puzzle"),
                boxShadow: `0 4px 20px ${getBadgeColor(games[0]?.type || "puzzle")}40`,
              }}
            >
              <Puzzle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: "#2957A4" }}>
              {title}
            </h2>
          </div>
          <Button asChild variant="ghost" className="text-sm hover:text-primary">
            <Link href={href}>
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.slice(0, 4).map((game, index) => {
          const isLocked = false // Untuk sementara tidak ada game yang terkunci

          const GameButton = (
            <Button
              size="sm"
              className={`w-full gap-1 transition-all duration-300 text-xs h-8 text-white shadow-lg ${isLocked ? "bg-gray-300 text-gray-600 cursor-not-allowed" : ""}`}
              style={{
                backgroundColor: isLocked ? "#D1D5DB" : "#2957A4",
                boxShadow: isLocked ? "none" : `0 4px 12px #2957A440`,
              }}
              disabled={isLocked}
            >
              <Play className="h-3 w-3" />
              {isLocked ? "Terkunci" : "Mainkan"}
            </Button>
          );

          return (
            <Card
              key={game.id}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col border-0 animate-bounce-in pt-0 "
              style={{
                animationDelay: `${index * 0.1}s`,
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 4px 20px rgba(41, 87, 164, 0.1)",
              }}
            >
              <div className="relative w-full h-42 flex-shrink-0 overflow-hidden rounded-t-lg">
                <Image
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-md" style={{ backgroundColor: "#FFCC29", color: "#2957A4" }}>
                  <Trophy className="w-3 h-3 mr-1" />
                  {game.xp_reward}
                </div>
              </div>

              <div className="p-4 space-y-3 flex flex-col flex-grow">
                <div className="space-y-2 flex-grow">
                  <h3 className="font-semibold text-sm line-clamp-2" style={{ color: "#2957A4" }}>
                    {game.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground truncate mr-2">{game.category}</span>
                  <Badge className="text-xs px-2 py-1 text-white" style={{ backgroundColor: getBadgeColor(game.type), border: "none" }}>
                    {game.type.charAt(0).toUpperCase() + game.type.slice(1)}
                  </Badge>
                </div>

                {status === 'authenticated' ? (
                  <Link href={isLocked ? "#" : getGameUrl(game)} className={isLocked ? "pointer-events-none" : ""}>
                    {GameButton}
                  </Link>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {GameButton}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Anda Belum Login</AlertDialogTitle>
                        <AlertDialogDescription>
                          Untuk memainkan game, Anda perlu login terlebih dahulu.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Nanti Saja</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/sign-in')}>
                          <LogIn className="w-4 h-4 mr-2" />
                          Login Sekarang
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}