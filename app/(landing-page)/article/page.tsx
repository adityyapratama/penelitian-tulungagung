import { Suspense } from "react";
import { getArticles } from "./lib/actions";
import ArticleGridClient from "@/components/(landing-page)/article/article";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import LoadingIndicator from "@/components/(landing-page)/article/loader";
import Image from "next/image";
import type { Metadata } from "next";
import { NavbarDemo } from "@/components/(landing-page)/navbar/navbar";

export const metadata: Metadata = {
  title: "Daftar Artikel",
  description:
    "Temukan berbagai artikel menarik seputar sejarah, kesenian, dan tradisi budaya Tulungagung.",
};

async function Articles() {
  const articles = await getArticles();
  return <ArticleGridClient articles={articles} />;
}

export default function ArticlePage() {
  return (
    <main className="container py-8 mx-auto">
      <NavbarDemo />
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-[#2957A4] mb-10">
                Artikel Pustaka Tulungagung
                <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-[#2957A4] to-[#FFCC29] bg-clip-text text-transparent">
                  All Articles
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/linear.webp`}
            alt="hero"
            height={720}
            width={1400}
            className="object-cover object-left-top h-full mx-auto rounded-2xl"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      <Suspense fallback={<LoadingIndicator />}>
        <Articles />
      </Suspense>
    </main>
  );
}
