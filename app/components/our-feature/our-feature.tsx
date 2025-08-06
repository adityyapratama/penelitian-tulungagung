"use client";

import { BentoDemo } from "@/app/components/our-feature/card";
import Image from "next/image";

export default function OurFeature() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900">
      {/* Container utama dengan padding dan lebar maksimum */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Bagian Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Fitur Unggulan Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Jelajahi berbagai fitur menarik dan inovatif yang kami tawarkan untuk pengalaman terbaik Anda.
          </p>
        </div>

        {/* Layout utama dengan grid dan jarak antar kolom yang lebih kecil */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
          
          {/* Sisi Kiri - BentoGrid */}
          {/* Menggunakan 9 kolom untuk konten agar lebih panjang */}
          <div className="lg:col-span-9 order-2 lg:order-1">
            <BentoDemo />
          </div>

          {/* Sisi Kanan - Gambar */}
          {/* Menggunakan 3 kolom untuk gambar agar lebih kecil */}
          <div className="lg:col-span-3  order-1 lg:order-2">
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/asset/quiz.png"
                alt="Fitur Quiz"
                width={1000}
                height={1000}
                className="rounded-4xl transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}