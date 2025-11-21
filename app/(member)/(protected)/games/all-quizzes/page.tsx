import { Suspense } from "react";
import { getAllQuizzesFormatted } from "../lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { QuizzesClient } from "./_components/quizzes-client";
import Image from "next/image";

const SmartphoneIcon = ({ className }: { className?: string; strokeWidth?: number }) => (
  // Use the SVG file stored in public/asset/hero/logo.svg. next/image will
  // serve it with proper caching. Width/height chosen to match w-32 h-32 (128px).
  <Image
    src="/asset/hero/logo.svg"
    alt="Pusaka Tulungagung"
    width={160}
    height={160}
    className={className}
  />
);
const features = [
  {
  icon: SmartphoneIcon,
    title: "Kuis berani chalange dirimu",
    description: "Belajar sejarah Duolingo for users atau terbukti efektif! Satu pelajaran pendek di Duolingo sama efektif dengan satu semester kursus universitas. Gratis, seru, dan terbukti efektif!",
    position: "right",
    color: "text-green-500"
  },
];


export default async function AllQuizzesPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-background landing-font">
      <div className="p-4 pt-20 md:p-6 md:pt-24">
        <div className="mx-auto space-y-6 md:space-y-8 max-w-7xl">
          {/* Header Section */}
           <Link 
              href="/games" 
              className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Games
            </Link>
          <section className="py-20 bg-background landing-font">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                feature.position === 'left' ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Illustration */}
              <div className={`${feature.position === 'left' ? 'md:order-2' : 'md:order-1'}`}>
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0  blur-3xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full ">
                    <feature.icon className={`w-40 h-40 ${feature.color}`} strokeWidth={4.} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${feature.position === 'left' ? 'md:order-1' : 'md:order-2'}`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
          <div className="space-y-4">
           
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl shadow-lg">
                <span className="text-2xl md:text-3xl">📝</span>
              </div>
               
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                  Semua Kuis
                </h1>
                <p className="text-sm md:text-lg text-muted-foreground mt-1 md:mt-2">
                  Uji pengetahuanmu dengan berbagai kuis menarik tentang sejarah
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
            <QuizzesData />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function QuizzesData() {
  const quizzes = await getAllQuizzesFormatted();
  return <QuizzesClient quizzes={quizzes} />;
}
