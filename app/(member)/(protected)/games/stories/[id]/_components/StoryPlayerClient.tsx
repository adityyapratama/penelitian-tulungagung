"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, RotateCcw, BookOpen, BarChart, Loader2 } from "lucide-react";
import type { CeritaInteraktif, Scene } from "@/lib/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleCard } from "@/components/article-card";
import { CreateProgress } from "@/app/(member)/lib/actions";

type Choice = {
  text: string;
  next: string;
};

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  excerpt: string;
}

type StoryPlayerProps = {
  storyDetails: CeritaInteraktif;
  scenes: Scene[];
  recommendedArticles: Article[];
};

export function StoryPlayerClient({ storyDetails, scenes, recommendedArticles }: StoryPlayerProps) {
  const router = useRouter();

  const [gameStarted, setGameStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [storyComplete, setStoryComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success?: string; error?: string; score?: string } | null>(null);

  useEffect(() => {
    const firstScene = scenes.find((s) => s.scene_key === "scene_01") || scenes.find(s => !s.is_ending) || scenes[0];
    setCurrentScene(firstScene);
  }, [scenes]);

  useEffect(() => {
    if (gameStarted && !startedAt) {
      setStartedAt(new Date());
    }
  }, [gameStarted, startedAt]);

  useEffect(() => {
    if (storyComplete && startedAt && !hasSubmitted) {
      const submitProgress = async () => {
        setIsSubmitting(true);
        setHasSubmitted(true);

        const progressData = {
          contentId: storyDetails.cerita_id,
          contentType: "cerita" as const,
          skor: finalScore,
          startedAt: startedAt,
        };

        const result = await CreateProgress(null, progressData);
        setSubmitResult(result);
        setIsSubmitting(false);
      };
      submitProgress();
    }
  }, [storyComplete, startedAt, hasSubmitted, storyDetails.cerita_id, finalScore]);

  const handleChoice = (nextSceneKey: string) => {
    const nextScene = scenes.find((s) => s.scene_key === nextSceneKey);
    if (nextScene) {
      setCurrentScene(nextScene);
      if (nextScene.is_ending) {
        setFinalScore(nextScene.ending_point);
        setStoryComplete(true);
      }
    }
  };

  const startGame = () => setGameStarted(true);

  const restartGame = () => {
    const firstScene = scenes.find((s) => s.scene_key === "scene_01") || scenes.find(s => !s.is_ending) || scenes[0];
    setCurrentScene(firstScene);
    setStoryComplete(false);
    setGameStarted(true);
    setStartedAt(new Date());
    setHasSubmitted(false);
    setFinalScore(0);
    setSubmitResult(null);
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
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {storyDetails.judul}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-600">
            {storyDetails.deskripsi}
          </p>
          <div className="mb-10 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-500">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">{scenes.length} Adegan</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <BarChart className="h-5 w-5" />
              <span className="font-medium">Tingkat Mudah</span>
            </div>
          </div>
          <Button
            onClick={startGame}
            size="lg"
            className="px-10 py-3 text-lg font-semibold"
          >
            Mainkan
          </Button>
        </div>

        <div className="mx-auto mt-16 w-full max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Rekomendasi Bacaan</h2>
            <p className="mt-2 text-gray-600">Tingkatkan wawasan Anda dengan artikel-artikel menarik ini.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {recommendedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (storyComplete && currentScene) {
  const endingType = currentScene.ending_type || "Default";
  const capitalizedEnding = endingType.charAt(0).toUpperCase() + endingType.slice(1);
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
        <div className="w-full max-w-2xl p-12 mx-auto text-center bg-white">
          {isSubmitting ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Menyimpan Progres...</h2>
            </div>
          ) : (
            <>
              <Award className="w-24 h-24 mx-auto mb-4 text-blue-600" />
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                Cerita Selesai!
              </h2>
              <Badge variant="outline" className={`mb-6 text-base font-medium ${getEndingBadgeColor(currentScene.ending_type)}`}>
                {capitalizedEnding} Ending
              </Badge>
              <p className="mb-8 text-lg text-gray-600">{currentScene.scene_text}</p>
              <div className="p-6 mb-8 rounded-lg bg-gray-100/70">
                <p className="text-xl text-gray-600">Kamu mendapatkan</p>
                <p className="mb-2 text-6xl font-bold text-blue-600">{finalScore}</p>
                <p className="text-xl text-gray-600">poin dari akhir cerita ini.</p>
              </div>
              {submitResult?.success && <p className="mb-6 font-medium text-green-600">Progres berhasil disimpan!</p>}
              {submitResult?.error && <p className="mb-6 font-medium text-red-500">{submitResult.error}</p>}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button onClick={restartGame} size="lg" className="inline-flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Main Lagi
                </Button>
                <Button onClick={() => router.push('/games/stories')} size="lg" variant="outline">
                  Pilih Cerita Lain
                </Button>
              </div>
            </>
          )}
        </div>

        {recommendedArticles.length > 0 && (
          <div className="mx-auto mt-16 w-full max-w-5xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">Rekomendasi Bacaan</h2>
              <p className="mt-2 text-gray-600">Tingkatkan wawasan Anda dengan artikel-artikel menarik ini.</p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {recommendedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentScene) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-white">
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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <span className="sr-only">Memuat cerita...</span>
    </div>
  );
}