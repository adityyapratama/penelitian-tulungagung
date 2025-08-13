// File: app/ui/LoadingIndicator.tsx

"use client";

import { useEffect, useState } from "react";
// Pastikan path impor ini sesuai dengan struktur proyek Anda
import { AnimatedCircularProgressBar } from "@/components/magicui/loader";

export default function LoadingIndicator() {
  const [progress, setProgress] = useState(0);

  // Logika useEffect ini membuat progress bar beranimasi di sisi client
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000); // Ganti durasi sesuai selera

    return () => clearInterval(interval);
  }, []);

  return (
    // Kita bungkus dengan div untuk menempatkannya di tengah layar
    <div className="flex items-center justify-center w-full h-64">
      <AnimatedCircularProgressBar
        value={progress}
        gaugePrimaryColor="rgb(79 70 229)" // Warna indigo-600
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />
    </div>
  );
}