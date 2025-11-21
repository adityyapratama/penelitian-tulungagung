import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link"; // Import Link untuk tombol
import { auth } from "@/auth";

import { LoginUpdate } from "@/app/(landing-page)/article/lib/actions";
import {
  getAllPuzzlesFormatted,
  getAllQuizzesFormatted,
  getAllStoriesFormatted,
} from "./lib/data";

import { GameList } from "./_components/game-list";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
// Jika kamu punya komponen Button dari shadcn/ui, bisa diimport disini.
// Tapi saya akan pakai class tailwind manual di bawah agar aman.

export default async function GamesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  return (
    <>
      <main className="min-h-screen bg-background landing-page">
        <div className="relative flex w-full flex-col items-center justify-start overflow-hidden pb-20">
          <BackgroundRippleEffect />

          <div className="mt-24 md:mt-32 w-full px-4">
            <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
              Pilih Game Favoritmu dan dapatkan EXP
            </h2>
            <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
              Ayo uji skill dan pengetahuanmu seputar dengan sejarah. mainkan game
              untuk dapatkan EXP dan kumpulkan untuk bersaing di leaderboard
            </p>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl w-full px-4 mt-16 space-y-16">
            
            {/* 1. Puzzle Games Section */}
            <div className="w-full flex flex-col md:flex-row md:gap-8">
              <div className="w-full md:basis-1/3 mb-8 md:mb-0">
                <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg md:sticky md:top-24">
                  <div className="rounded-md p-6">
                    <div className="h-40 w-full rounded-lg bg-linear-to-r from-blue-200 to-sky-200" />
                    <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base">
                      <PointerHighlight
                        rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
                        pointerClassName="text-yellow-500 h-3 w-3"
                        containerClassName="inline-block mr-1"
                      >
                        <span className="relative z-10">collab tool</span>
                      </PointerHighlight>
                      of the century with max benefits and minimal effort.
                    </div>
                    <p className="mt-4 text-sm text-neutral-500">
                      Our state of the art collab tool of the century with max
                      benefits.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:basis-2/3 flex flex-col gap-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <PuzzleList />
                </Suspense>
                {/* Button Puzzle */}
                <div className="flex justify-end">
                    <Link
                        href="games/all-puzzles" 
                        className="w-full md:w-auto inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-primary'/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                    >
                        Lihat Semua Puzzle &rarr;
                    </Link>
                </div>
              </div>
            </div>

            {/* 2. Quiz Games Section */}
            <div className="w-full flex flex-col md:flex-row md:gap-8">
              <div className="w-full md:basis-2/3 order-2 md:order-1 flex flex-col gap-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <QuizList />
                </Suspense>
                {/* Button Quiz */}
                <div className="flex justify-end">
                    <Link
                        href="games/all-quizzes" 
                        className="w-full md:w-auto inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-primary/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                    >
                        Lihat Semua Quiz &rarr;
                    </Link>
                </div>
              </div>
              <div className="w-full md:basis-1/3 mb-8 md:mb-0 order-1 md:order-2">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-6 rounded-lg md:sticky md:top-24">
                  <div className="rounded-md p-6">
                    <div className="h-40 w-full rounded-lg bg-linear-to-r from-blue-200 to-purple-200" />
                    <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base">
                      Discover our
                      <PointerHighlight
                        rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose"
                        pointerClassName="text-blue-500 h-3 w-3"
                        containerClassName="inline-block mx-1"
                      >
                        <span className="relative z-10">innovative </span>
                      </PointerHighlight>
                      solutions for your business needs.
                    </div>
                    <p className="mt-4 text-sm text-neutral-500">
                      Transforming ideas into reality with cutting-edge
                      technology and expert guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Story Games Section */}
            <div className="w-full flex flex-col md:flex-row md:gap-8">
              <div className="w-full md:basis-1/3 mb-8 md:mb-0">
                <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg md:sticky md:top-24">
                  <div className="rounded-md p-6">
                    <div className="h-40 w-full rounded-lg bg-linear-45 from-green-200 to-yellow-200" />
                    <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base">
                      Experience the future with our
                      <PointerHighlight
                        rectangleClassName="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 leading-loose"
                        pointerClassName="text-green-500 h-3 w-3"
                        containerClassName="inline-block ml-1"
                      >
                        <span className="relative z-10">
                          sustainable technology
                        </span>
                      </PointerHighlight>
                      .
                    </div>
                    <p className="mt-4 text-sm text-neutral-500">
                      Eco-friendly solutions designed for a better tomorrow and
                      reduced environmental impact.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:basis-2/3 flex flex-col gap-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <StoryList />
                </Suspense>
                {/* Button Story */}
                <div className="flex justify-end">
                    <Link
                        href="/games/all-stories" 
                        className="w-full md:w-auto inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-primary/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                    >
                        Lihat Semua Story &rarr;
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
    </div>
  );
}

async function PuzzleList() {
  await LoginUpdate();
  const puzzles = await getAllPuzzlesFormatted();
  return <GameList games={puzzles.slice(0, 5)} title="Puzzle Games" />;
}

async function QuizList() {
  await LoginUpdate();
  const quizzes = await getAllQuizzesFormatted();
  return <GameList games={quizzes.slice(0, 5)} title="Quiz Games" />;
}

async function StoryList() {
  await LoginUpdate();
  const stories = await getAllStoriesFormatted();
  return <GameList games={stories.slice(0, 5)} title="Story Games" />;
}