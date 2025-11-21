"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { GameCardData } from "../lib/data";

interface GameListProps {
  games: GameCardData[];
  title: string;
}

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export function GameList({ games, title }: GameListProps) {
  const [active, setActive] = useState<GameCardData | null>(null);
  const { status } = useSession();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null));

  const getGameUrl = (game: GameCardData) => {
    const gameId = game.id.split("-")[1];
    if (game.type === "kuis") return `/games/quiz/${gameId}`;
    if (game.type === "cerita") return `/games/stories/${gameId}`;
    return `/games/puzzle/${gameId}`;
  };

  const getBgColorClass = (type: string) => {
    switch (type) {
      case "puzzle": return "bg-red-500";
      case "kuis": return "bg-blue-600";
      case "cerita": return "bg-green-500";
      default: return "bg-blue-600";
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6 z-50"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={600}
                  height={600}
                  src={active.image}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 text-xl"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-sm mt-2"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-2 mb-4"
                  >
                    <Badge className={`${getBgColorClass(active.type)} text-white hover:${getBgColorClass(active.type)}/90 capitalize`}>
                      {active.type}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                      <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                      {active.xp_reward} XP
                    </Badge>
                  </motion.div>
                  <div className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                    {active.type === "puzzle" && (
                      <p className="text-sm text-muted-foreground">
                        Pecahkan teka-teki ini untuk mendapatkan {active.xp_reward} XP!
                      </p>
                    )}
                    {active.type === "kuis" && (
                      <p className="text-sm text-muted-foreground">
                        Uji pengetahuan Anda dengan kuis ini dan raih {active.xp_reward} XP!
                      </p>
                    )}
                    {active.type === "cerita" && (
                      <p className="text-sm text-muted-foreground">
                        Jelajahi cerita interaktif ini dan dapatkan {active.xp_reward} XP!
                      </p>
                    )}
                    <Link
                      href={getGameUrl(active)}
                      className="px-4 py-2 text-sm rounded-full font-bold bg-green-500 text-white hover:bg-green-600 transition-colors w-full text-center block"
                      onClick={(e) => {
                        if (status === "unauthenticated") {
                          e.preventDefault();
                          router.push("/member/signin");
                        }
                      }}
                    >
                      Main Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">{title}</h3>
        <ul className="w-full space-y-3">
          {games.map((game) => (
            <motion.div
              layoutId={`card-${game.title}-${id}`}
              key={`card-${game.title}-${id}`}
              onClick={() => setActive(game)}
              className="p-3 sm:p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
            >
              <div className="flex gap-3 sm:gap-4 flex-row flex-1 min-w-0">
                <motion.div layoutId={`image-${game.title}-${id}`} className="flex-shrink-0">
                  <Image
                    width={100}
                    height={100}
                    src={game.image}
                    alt={game.title}
                    className="h-16 w-16 sm:h-20 sm:w-20 lg:h-14 lg:w-14 rounded-lg object-cover object-top"
                  />
                </motion.div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <motion.h3
                    layoutId={`title-${game.title}-${id}`}
                    className="font-medium text-sm sm:text-base text-neutral-800 dark:text-neutral-200 truncate"
                  >
                    {game.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${game.description}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm line-clamp-2"
                  >
                    {game.description}
                  </motion.p>
                </div>
              </div>
              <motion.button
                layoutId={`button-${game.title}-${id}`}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black transition-colors ml-2 flex-shrink-0"
              >
                <span className="hidden sm:inline">Lihat Detail</span>
                <span className="sm:hidden">Detail</span>
              </motion.button>
            </motion.div>
          ))}
        </ul>
      </div>
    </>
  );
}