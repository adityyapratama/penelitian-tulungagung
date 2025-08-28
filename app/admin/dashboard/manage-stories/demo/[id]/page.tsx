"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import { GetScenesByStoryId } from "../../lib/data"
import { IScene } from "@/types"


export default function StoryPlayer() {
  const params = useParams()
  const storyId = params.id as string

  const [scenes, setScenes] = useState<IScene[]>([])
  const [currentScene, setCurrentScene] = useState<IScene | null>(null)
  const [loading, setLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    loadScenes()
  }, [storyId])

const loadScenes = async () => {
  try {
    const response = await GetScenesByStoryId(storyId)

    if ("error" in response) {
      console.error("Error loading scenes:", response.error)
      setLoading(false)
      return
    }

    setScenes(response)

    const firstScene =
      response.find((s) => s.scene_key === "scene_01") ||
      response.find((s) => !s.is_ending)

    setCurrentScene(firstScene!)
    setLoading(false)
  } catch (error) {
    console.error("Unexpected error:", error)
    setLoading(false)
  }
}



  const handleChoice = (nextSceneKey: string) => {
    const nextScene = scenes.find((s) => s.scene_key === nextSceneKey)
    if (nextScene) {
      setCurrentScene(nextScene)
    }
  }

  const startGame = () => {
    setGameStarted(true)
  }

  const restartGame = () => {
    const firstScene = scenes.find((s) => s.scene_key === "scene_01") || scenes.find((s) => !s.is_ending)
    setCurrentScene(firstScene!)
    setGameStarted(true)
  }

  const getEndingBadgeColor = (endingType: string | null) => {
    switch (endingType) {
      case "good":
        return "bg-green-500"
      case "bad":
        return "bg-red-500"
      case "neutral":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Interactive Story</CardTitle>
            <p className="text-gray-600 mt-2">Ready to begin your adventure?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500">Found {scenes.length} scenes in this story</div>
            <Button onClick={startGame} className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
              Start Adventure
            </Button>
            <Link href={`/admin/dashboard/manage-stories/configuration/${storyId}`}>
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentScene) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">No scenes found in this story.</p>
            <Link href={`/admin/dashboard/manage-stories/configuration/${storyId}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href={`/admin/dashboard/manage-stories/configuration/${storyId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Editor
            </Button>
          </Link>
          <Button onClick={restartGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        {/* Main Story Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{currentScene.scene_key}</CardTitle>
              {currentScene.is_ending && (
                <Badge className={`${getEndingBadgeColor(currentScene.ending_type!)} text-white`}>
                  {currentScene.ending_type} ending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">{currentScene.scene_text}</p>

            {/* Choices */}
            {!currentScene.is_ending && currentScene.scene_choices && currentScene.scene_choices.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 mb-3">What do you choose?</h3>
                {currentScene.scene_choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice.next)}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-4 hover:bg-purple-50 hover:border-purple-300"
                  >
                    <span className="text-wrap">{choice.text}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Ending */}
            {currentScene.is_ending && (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-gray-800">The End</div>
                {currentScene.ending_point > 0 && (
                  <div className="text-lg">
                    <span className="text-gray-600">Score: </span>
                    <span className="font-bold text-purple-600">{currentScene.ending_point} points</span>
                  </div>
                )}
                <Button onClick={restartGame} className="bg-purple-600 hover:bg-purple-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress indicator */}
        <div className="text-center text-sm text-gray-500">
          Scene: {currentScene.scene_key}
          {currentScene.is_ending && ` • ${currentScene.ending_type} ending`}
        </div>
      </div>
    </div>
  )
}
