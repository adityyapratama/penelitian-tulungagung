

import {NavbarDemo} from "@/components/navbar/navbar";
import {PlaceholdersAndVanishInputDemo} from "@/components/hero/PlaceholdersAndVanishInputDemo";
import { AnimationWrapper } from '@/components/animation-wrapper';
import { Suspense } from 'react';
import {MarqueeDemo} from "@/components/comment/comment";
import OurFeature from "@/components/our-feature/our-feature";
import ArticleGrid from "@/components/article/article";
import Footer from "@/components/footer/footerPage";
import ArticlePage from "@/components/article/article-card";


export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <NavbarDemo/>   
      
      <main className="max-w-full px-4 pt-20 sm:px-8 lg:px-20">
        <section id="hero" className="flex items-center justify-center min-h-screen">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
              <PlaceholdersAndVanishInputDemo />
            </AnimationWrapper> 
          </Suspense>
        </section>

        <section id="comments-reviews" className="w-full max-w-full py-16 ">
          <h1 className="justify-center mb-10 text-4xl font-bold text-center text-blue-900 dark:text-white ">User Reviews</h1>
          <Suspense fallback={<div className="w-full h-32" />}>
            <AnimationWrapper>
              <MarqueeDemo/>
            </AnimationWrapper> 
          </Suspense>
        </section>


          <section id="our-feature" className="flex items-center justify-center min-h-screen">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
              <OurFeature />
            </AnimationWrapper>
          </Suspense>
        </section>

        {/* <section id="hero-video" className="flex items-center justify-center min-h-screen">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
              <Video />
            </AnimationWrapper>
          </Suspense>
        </section> */}

          <section id="hero-video" className="flex items-center justify-center min-h-screen">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
              <ArticlePage />
            </AnimationWrapper>
          </Suspense>
        </section>


        
      </main>
    </div>
  );
}