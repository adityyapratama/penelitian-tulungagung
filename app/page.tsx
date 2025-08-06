

import {NavbarDemo} from "@/app/components/navbar/navbar";
import {PlaceholdersAndVanishInputDemo} from "@/app/components/hero/PlaceholdersAndVanishInputDemo";
import { AnimationWrapper } from '@/app/components/animation-wrapper';
import { Suspense } from 'react';
import {MarqueeDemo} from "@/app/components/comment/comment";
import OurFeature from "@/app/components/our-feature/our-feature";
import ArticleGrid from "@/app/components/article/article";
import Footer from "@/app/components/footer/footerPage";



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

         <section id="article" className="relative py-24 sm:py-32"> {/* Updated class for better spacing */}
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
               <ArticleGrid limit={3} />
            </AnimationWrapper>
          </Suspense>
        </section>


        
          <section id="Footer" className="relative"> 
          
            <AnimationWrapper>
               <Footer/>
            </AnimationWrapper>
  
        </section>
      </main>
    </div>
  );
}