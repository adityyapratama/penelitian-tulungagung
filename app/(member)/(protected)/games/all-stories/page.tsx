import { Suspense } from "react";
import { getAllStoriesFormatted } from "../lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StoriesClient } from "./_components/stories-client";


export default async function AllStoriesPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  return (
    
    <main className="min-h-screen bg-background landing-font">
        
      <div className="p-4 pt-20 md:p-6 md:pt-24">
        <div className="mx-auto space-y-6 md:space-y-8 max-w-7xl">
          {/* Header Section */}
          <div className="space-y-4">
            <Link 
              href="/games" 
              className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Games
            </Link>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-2xl shadow-lg">
                <span className="text-2xl md:text-3xl">📚</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                  Semua Cerita
                </h1>
                <p className="text-sm md:text-lg text-muted-foreground mt-1 md:mt-2">
                  Nikmati cerita interaktif yang seru dan penuh petualangan sejarah
                </p>
              </div>
            </div>
          </div>

          {/* Games Grid with Search and Filter */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
              </div>
            }
          >
            <StoriesData />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function StoriesData() {
  const stories = await getAllStoriesFormatted();
  return <StoriesClient stories={stories} />;
}
