"use client";

import { BentoDemo } from "@/components/(landing-page)/our-feature/card";
import Image from "next/image";
import {Iphone15Pro} from "@/components/magicui/iphone-15-pro";

export default function OurFeature() {
  return (
    <div className="w-full min-h-screen bg-white">\
    
      {/* Container utama dengan padding dan lebar maksimum */}
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 ">
        {/* Bagian Header */}
        
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Fitur Unggulan Kami
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Jelajahi berbagai fitur menarik dan inovatif yang kami tawarkan untuk pengalaman terbaik Anda.
          </p>
        </div>

        {/* Layout utama dengan grid dan jarak antar kolom yang lebih kecil */}
        <div className="grid items-center grid-cols-1 gap-2 lg:grid-cols-12">
          
          {/* Sisi Kiri - BentoGrid */}
          {/* Menggunakan 9 kolom untuk konten agar lebih panjang */}
          <div className="order-2 lg:col-span-9 lg:order-1">
            <BentoDemo />
          </div>

          {/* Sisi Kanan - Gambar */}
          {/* Menggunakan 3 kolom untuk gambar agar lebih kecil */}
          <div className="order-1 lg:col-span-3 lg:order-2">
            <div className="flex justify-center lg:justify-end">
              <Iphone15Pro className="transition-transform duration-300 rounded-4xl hover:scale-105" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}