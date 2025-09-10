

import {NavbarDemo} from "@/components/(landing-page)/navbar/navbar";
import HeroSection from "@/components/(landing-page)/hero/hero";
import { AnimationWrapper } from '@/components/animation-wrapper';
import { Suspense } from 'react';
import {MarqueeDemo} from "@/components/(landing-page)/comment/comment";
import OurFeature from "@/components/(landing-page)/our-feature/our-feature";
import ArticleGrid from "@/components/(landing-page)/article/article";
import Footer from "@/components/(landing-page)/footer/footerPage";
import ArticlePage from "@/components/(landing-page)/article/article-card";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import {AccordionDemo} from "@/components/(landing-page)/stacked/stacked";




export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <NavbarDemo/>   
      
      <main className="">
        <section id="hero">
          <Suspense >
            <AnimationWrapper>
              <HeroSection />
            </AnimationWrapper> 
          </Suspense>
        </section>

        <section id="comments-reviews" className="w-full max-w-full py-16 bg-blue-">
            <TypingAnimation startOnView={true}>Testimonial👋</TypingAnimation>
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


        <section id="stacked" className="w-full py-16 md:py-24">
                <div className="container px-4 mx-auto">
                  <div className="max-w-4xl mx-auto">
                    <Suspense fallback={
                      <div className="w-full">
                        <div className="h-16 mb-2 bg-gray-200 rounded animate-pulse" />
                        <div className="h-16 mb-2 bg-gray-200 rounded animate-pulse" />
                        <div className="h-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    }>
                      <AnimationWrapper>
                        <AccordionDemo />
                      </AnimationWrapper>
                    </Suspense>
                  </div>
                </div>
          </section>

          <section id="Footer" className="Full-h-screen">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
              <Footer />
            </AnimationWrapper>
          </Suspense>
        </section>



        
      </main>
    </div>
  );
}