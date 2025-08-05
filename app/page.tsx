
import {NavbarDemo} from "@/app/components/navbar/navbar";
import {PlaceholdersAndVanishInputDemo} from "@/app/components/hero/PlaceholdersAndVanishInputDemo";
import { AnimationWrapper } from '@/app/components/animation-wrapper';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <NavbarDemo/>
      
        <section id="hero">
          <Suspense fallback={<div className="h-screen" />}>
            <AnimationWrapper>
              <PlaceholdersAndVanishInputDemo />
            </AnimationWrapper>
          </Suspense>
        </section>
    </div>
  );
}
