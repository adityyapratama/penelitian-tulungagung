"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, RotateCcw } from "lucide-react";
import type { CeritaInteraktif, Scene } from "@/lib/generated/prisma";

type Choice = {
  text: string;
  next: string;
};

type StoryPlayerProps = {
  storyDetails: CeritaInteraktif;
  scenes: Scene[];
};

export function StoryPlayerClient({ storyDetails, scenes }: StoryPlayerProps) {
  const router = useRouter();

  const [gameStarted, setGameStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [storyComplete, setStoryComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const firstScene = scenes.find((s) => s.scene_key === "scene_01") || scenes.find(s => !s.is_ending) || scenes[0];
    setCurrentScene(firstScene);
  }, [scenes]);

  const handleChoice = (nextSceneKey: string) => {
    const nextScene = scenes.find((s) => s.scene_key === nextSceneKey);
    if (nextScene) {
      setCurrentScene(nextScene);
      if (nextScene.is_ending) {
        setStoryComplete(true);
        setFinalScore(nextScene.ending_point);
      }
    }
  };

  const startGame = () => setGameStarted(true);

  const restartGame = () => {
    const firstScene = scenes.find((s) => s.scene_key === "scene_01") || scenes.find(s => !s.is_ending) || scenes[0];
    setCurrentScene(firstScene);
    setStoryComplete(false);
    setGameStarted(true);
  };
  
  const getEndingBadgeColor = (endingType: string | null) => {
    switch (endingType) {
      case "good": return "bg-green-100 text-green-800 border-green-300";
      case "bad": return "bg-red-100 text-red-800 border-red-300";
      case "neutral": return "bg-gray-100 text-gray-800 border-gray-300";
      default: return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const choices = currentScene?.scene_choices ? (currentScene.scene_choices as Choice[]) : [];

  if (!gameStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
        <Card className="w-full max-w-lg text-center shadow-lg rounded-2xl">
          <CardHeader>
            {storyDetails.thumbnail && (
              <div className="mb-6 overflow-hidden rounded-lg">
                <Image
                  src={storyDetails.thumbnail}
                  alt={storyDetails.judul}
                  width={600}
                  height={300}
                  className="object-cover w-full h-56"
                />
              </div>
            )}
            <CardTitle className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text">
              {storyDetails.judul}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-8 text-lg text-gray-600">{storyDetails.deskripsi}</p>
            <Button
              onClick={startGame}
              size="lg"
              className="w-full text-lg font-semibold transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg"
            >
              Mulai Petualangan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (storyComplete && currentScene) {
    return (
       <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
        <div className="w-full max-w-2xl p-12 mx-auto text-center bg-white shadow-xl rounded-2xl">
          <Award className="w-24 h-24 mx-auto mb-4 text-blue-600" />
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Cerita Selesai!
          </h2>
          <Badge variant="outline" className={`mb-6 text-base font-medium ${getEndingBadgeColor(currentScene.ending_type)}`}>
            {currentScene.ending_type || "Default"} Ending
          </Badge>
          <p className="mb-8 text-lg text-gray-600">{currentScene.scene_text}</p>
          <div className="p-6 mb-8 rounded-lg bg-gray-100/70">
              <p className="text-xl text-gray-600">Kamu mendapatkan</p>
              <p className="mb-2 text-6xl font-bold text-blue-600">{finalScore}</p>
              <p className="text-xl text-gray-600">poin dari akhir cerita ini.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button onClick={restartGame} size="lg" className="inline-flex items-center gap-2">
              <RotateCcw className="w-5 h-5" /> Main Lagi
            </Button>
            <Button onClick={() => router.push('/games/stories')} size="lg" variant="outline">
              Pilih Cerita Lain
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScene) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
        <div className="w-full max-w-3xl">
          <Card className="w-full shadow-lg rounded-2xl">
            <CardContent className="p-8 md:p-12">
              <p className="mb-10 text-xl leading-relaxed text-gray-700 md:text-2xl">
                {currentScene.scene_text}
              </p>
              <div className="space-y-4">
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice.next)}
                    className="w-full h-auto min-h-14 px-6 py-4 rounded-lg font-medium text-base text-left transition-all duration-300 border-2 bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50/70 hover:text-blue-700"
                  >
                    <span className="text-wrap">{choice.text}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <div>Memuat cerita...</div>;
}