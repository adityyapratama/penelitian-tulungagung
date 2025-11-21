// import { Suspense } from "react"
// import { getAllPuzzlesFormatted, getAllQuizzesFormatted, getAllStoriesFormatted } from "./lib/data"
// import { GameBrowser } from "./_components/game-browser"
// import { LoginUpdate } from "@/app/(landing-page)/article/lib/actions"
// import {BackgroundRippleEffectDemo} from "@/components/game/dashboard"


// export default function GamesPage() {
//   return (
//     <>
    
//       <main className="min-h-screen bg-primary landing-page">
        
//         <div className="p-6 pt-20 md:pt-24">
//           <div className="mx-auto space-y-8 max-w-7xl">
//             <div className="space-y-4 text-center">
//               <h1 className="text-4xl font-bold md:text-5xl text-primary text-balance animate-fade-in">
//                 Pilih Game Favoritmu
//               </h1>
//               <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
//                 Jelajahi berbagai jenis permainan edukatif yang menarik. Kuis untuk menguji pengetahuan, cerita
//                 interaktif untuk petualangan seru, dan puzzle untuk mengasah logika.
//               </p>
//             </div>
//             <BackgroundRippleEffectDemo/>

//             <Suspense
//               fallback={
//                 <div className="flex items-center justify-center py-20">
//                   <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
//                 </div>
//               }
//             >
//               <GamesDataContainer />
//             </Suspense>
//           </div>
//         </div>
//       </main>
//     </>
//   )
// }

// async function GamesDataContainer() {
//   await LoginUpdate()
//   const [puzzles, quizzes, stories] = await Promise.all([
//     getAllPuzzlesFormatted(),
//     getAllQuizzesFormatted(),
//     getAllStoriesFormatted(),
//   ])

//   return <GameBrowser puzzles={puzzles} quizzes={quizzes} stories={stories} />
// }



import { Suspense } from "react"
import { getAllPuzzlesFormatted, getAllQuizzesFormatted, getAllStoriesFormatted } from "./lib/data"
import { GameBrowser } from "./_components/game-browser"
import { LoginUpdate } from "@/app/(landing-page)/article/lib/actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {BackgroundRippleEffectDemo} from "@/components/game/dashboard"

export default async function GamesPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/sign-in")
  }
  return (
    <>
    <BackgroundRippleEffectDemo/>
    
    
      <main className="min-h-screen bg-background landing-page">
        
        
        <div className="p-6 pt-20 md:pt-24">
          <div className="mx-auto space-y-8 max-w-7xl">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold md:text-5xl text-primary text-balance animate-fade-in">
                Pilih Game Favoritmu 
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
                Jelajahi berbagai jenis permainan edukatif yang menarik. Kuis untuk menguji pengetahuan, cerita
                interaktif untuk petualangan seru, dan puzzle untuk mengasah logika.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
                </div>
              }
            >
              <GamesDataContainer />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  )
}

async function GamesDataContainer() {
  await LoginUpdate()
  const [puzzles, quizzes, stories] = await Promise.all([
    getAllPuzzlesFormatted(),
    getAllQuizzesFormatted(),
    getAllStoriesFormatted(),
  ])

  return <GameBrowser puzzles={puzzles} quizzes={quizzes} stories={stories} />
}
