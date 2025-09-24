"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Play, ArrowRight, Zap, Lock, CheckCircle, Puzzle } from "lucide-react"
import type { GameCardData } from "../lib/data"
import Link from "next/link"
import Image from "next/image"

interface GameRowProps {
  title: string
  description: string
  games: GameCardData[]
  href: string
}

export function GameRow({ title, description, games, href }: GameRowProps) {
  const getGameUrl = (game: GameCardData) => {
    const id = game.id.split("-")[1]
    if (game.type === "kuis") {
      return `/games/kuis/${id}`
    }
    if (game.type === "cerita") {
      return `/games/cerita/${id}`
    }
    return `/games/puzzle/${id}`
  }

  // const getMockDifficulty = (xpReward: number) => {
  //   if (xpReward <= 50) return "mudah"
  //   if (xpReward <= 100) return "sedang"
  //   return "sulit"
  // }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "mudah":
        return "#10B981"
      case "sedang":
        return "#F59E0B"
      case "sulit":
        return "#EF4444"
      default:
        return "#2957A4"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "puzzle":
        return "#F44336"
      case "kuis":
        return "#2957A4"
      case "cerita":
        return "#4CAF50"
      default:
        return "#2957A4"
    }
  }

  const getMockProgress = (index: number) => {
    const progressValues = [0, 25, 60, 100, 0, 40, 80]
    return progressValues[index % progressValues.length]
  }

  const getMockLocked = (index: number) => {
    return index % 4 === 3
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
          const mockProgress = getMockProgress(index)
          const mockCompleted = mockProgress === 100
          const mockLocked = getMockLocked(index)

          return (
            <Card
              key={game.id}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col border-0 animate-bounce-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 4px 20px rgba(41, 87, 164, 0.1)",
              }}
            >
              <div className="relative w-full h-34 flex-shrink-0 overflow-hidden rounded-t-lg">
                <Image
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />

                <div
                  className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-md animate-pulse"
                  style={{
                    backgroundColor: "#FFCC29",
                    color: "#2957A4",
                    boxShadow: "0 0 10px rgba(255, 204, 41, 0.5)",
                  }}
                >
                  <Trophy className="w-3 h-3 mr-1" />
                  {game.xp_reward}
                </div>

                {mockCompleted && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                )}

                {mockLocked && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <Lock className="w-8 h-8 text-gray-600" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3 flex flex-col flex-grow">
                <div className="space-y-2 flex-grow">
                  <h3
                    className="font-semibold text-sm line-clamp-2 group-hover:opacity-80 transition-colors"
                    style={{ color: "#2957A4" }}
                  >
                    {game.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{game.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground truncate mr-2">{game.category}</span>
                  <Badge
                    className="text-xs px-2 py-1 text-white"
                    style={{
                      backgroundColor: getBadgeColor(game.type),
                      border: "none",
                    }}
                  >
                    {game.type.charAt(0).toUpperCase() + game.type.slice(1)}
                  </Badge>
                </div>

                {mockProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{mockProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500 relative"
                        style={{
                          width: `${mockProgress}%`,
                          background: `linear-gradient(90deg, ${getBadgeColor(game.type)} 0%, ${getBadgeColor(game.type)}CC 100%)`,
                          boxShadow: `0 0 8px ${getBadgeColor(game.type)}40`,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  asChild
                  size="sm"
                  className={`gap-1 transition-all duration-300 text-xs h-8 ${
                    mockLocked
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : mockProgress > 0
                        ? "text-white shadow-lg"
                        : "text-white shadow-lg"
                  }`}
                  style={{
                    backgroundColor: mockLocked ? "#D1D5DB" : mockProgress > 0 ? "#10B981" : "#2957A4",
                    boxShadow: mockLocked ? "none" : `0 4px 12px ${mockProgress > 0 ? "#10B98140" : "#2957A440"}`,
                  }}
                  disabled={mockLocked}
                >
                  <Link href={getGameUrl(game)}>
                    <Play className="h-3 w-3" />
                    {mockLocked ? "Terkunci" : mockProgress > 0 ? "Lanjutkan" : "Mainkan"}
                  </Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
