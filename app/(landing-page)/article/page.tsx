// UPDATE FILE YANG SUDAH ADA DENGAN CODE INI:

import { Suspense } from 'react';
import { getArticles } from './lib/actions'; // Update import ini
import ArticleGridClient from '@/components/(landing-page)/article/article';
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import LoadingIndicator from '@/components/(landing-page)/article/loader';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daftar Artikel', 
    description: 'Temukan berbagai artikel menarik seputar sejarah, kesenian, dan tradisi budaya Tulungagung.',
};

// Component untuk fetch semua artikel
async function Articles() {
    const articles = await getArticles(); // Ambil SEMUA artikel (tanpa limit)
    return <ArticleGridClient articles={articles} />; // Tidak ada prop limit
}

export default function ArticlePage() {
    return (
        <main className="container py-8 mx-auto">
            <div className="flex flex-col overflow-hidden">
                <ContainerScroll
                    titleComponent={
                        <>
                            <h1 className="text-4xl font-semibold text-black dark:text-white">
                                Artikel Pustaka Tulungagung
                                <br />
                                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
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