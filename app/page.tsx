import {NavbarDemo} from "@/components/(landing-page)/navbar/navbar";
import { AnimationWrapper } from '@/components/animation-wrapper';
import { Suspense } from 'react';
import {MarqueeDemo} from "@/components/(landing-page)/comment/comment";
import OurFeature from "@/components/(landing-page)/our-feature/our-feature";
import Footer from "@/components/(landing-page)/footer/footerPage";
import ArticlePage from "@/components/(landing-page)/article/article-card";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import {AccordionDemo} from "@/components/(landing-page)/stacked/stacked";
import HeroSection from "@/components/(landing-page)/hero2/page";
import { WhyLearn } from "@/components/(landing-page)/WhyLearn/page";
import { WhyUs} from "@/components/(landing-page)/whyUs/page";
import Head from "next/head";




export default function Home() {
  return (
    <div className="min-h-screen landing-font">
       {/* favicon */}
       <Head>
        <title>Pusaka TulungAgung</title> 
        <link rel="icon" href="/icon.png" type="image/png" />
      </Head>


      <NavbarDemo/>  

     
      
      <main className="">
        <section id="hero" className="mb-40">
          <Suspense >
            <AnimationWrapper>
              <HeroSection />
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

        <section id="why-learn" className="flex items-center justify-center min-h-screen">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
              <WhyLearn />
            </AnimationWrapper>
          </Suspense>
        </section>

        <section id="why-Us" className="flex items-center justify-center min-h-screen">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <AnimationWrapper>
              <WhyUs />
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

          <section id="article" className="flex items-center justify-center min-h-screen">
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