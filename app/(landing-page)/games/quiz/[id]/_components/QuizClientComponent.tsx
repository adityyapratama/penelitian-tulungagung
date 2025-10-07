"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreateProgress } from "@/app/(member)/lib/actions";


type Pilihan = {
  jawaban_id: number;
  teks_jawaban: string;
  score: number;
  pertanyaan_id: number | null;
};

type Pertanyaan = {
  pertanyaan_id: number;
  teks_pertanyaan: string;
  image?: string | null;
  tipe: string;
  poin: number;
  kuis_id: number | null;
  urutan: number;
  PilihanKuis: Pilihan[];
};

type Kuis = {
  kuis_id: number;
  judul: string;
  xp_reward: number;
};

//props
type QuizComponentProps = {
  quizDetails: Kuis;
  questions: Pertanyaan[];
};

export function QuizClientComponent({ quizDetails, questions }: QuizComponentProps) {
  const router = useRouter();
  
  // State untuk alur kuis
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // Menyimpan jawaban user {questionIndex: answerId}
  const [quizComplete, setQuizComplete] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success?: string; error?: string} | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false); // ✅ State untuk menampilkan kunci jawaban

  // ✅ Fungsi untuk menghitung skor akhir
  const calculateFinalScore = useCallback(() => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      const userAnswerId = userAnswers[index];
      if (userAnswerId) {
        const selectedChoice = question.PilihanKuis.find(choice => choice.jawaban_id === userAnswerId);
        if (selectedChoice && selectedChoice.score > 0) {
          totalScore += question.poin;
        }
      }
    });
    return totalScore;
  }, [questions, userAnswers]);

  // Catat waktu mulai saat kuis dimuat
  useEffect(() => {
    setStartedAt(new Date());
  }, []);

  //  Kirim data ke server secara otomatis saat kuis selesai
  useEffect(() => {
    // Hanya jalankan jika kuis sudah selesai, waktu mulai sudah tercatat, dan belum pernah submit
    if (quizComplete && startedAt && !hasSubmitted) {
      setHasSubmitted(true); //Set flag untuk mencegah multiple submit
      setIsSubmitting(true);
      
      const submitProgress = async () => {
        try {
          const finalScore = calculateFinalScore();
          const progressData = {
            contentId: quizDetails.kuis_id,
            contentType: "kuis" as const,
            skor: finalScore,
            startedAt: startedAt
          };
          
          const result = await CreateProgress(null, progressData);
          setSubmitResult(result);
        } catch {
          setSubmitResult({ error: "Gagal menyimpan progress" });
        } finally {
          setIsSubmitting(false);
        }
      };
      
      submitProgress();
    }
  }, [quizComplete, startedAt, quizDetails.kuis_id, hasSubmitted, calculateFinalScore]); // ✅ Dependency yang aman


  const handleAnswer = (choice: Pilihan) => {
    // Simpan jawaban user untuk pertanyaan ini
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: choice.jawaban_id
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz selesai
      setQuizComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    // Redirect ke halaman games untuk pilih quiz lain
    router.push('/games');
  };

  const getButtonClass = (choice: Pilihan) => {
    const baseClass = "w-full h-auto min-h-14 px-6 py-4 rounded-lg font-medium text-base transition-all duration-300 border-2 text-wrap text-left ";
    
    const isSelected = userAnswers[currentQuestionIndex] === choice.jawaban_id;
    
    // Jika quiz belum selesai - hanya highlight pilihan yang dipilih
    if (!quizComplete) {
        return baseClass + (isSelected
          ? "bg-blue-50 border-blue-500 text-blue-700"  // Pilihan yang dipilih
          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"); // Pilihan lain
    }
    
    // Jika quiz selesai dan showAnswerKey aktif - tampilkan feedback
    if (showAnswerKey) {
      if (choice.score > 0) {
        return baseClass + "bg-green-50 border-green-500 text-green-700";
      }
      if (isSelected) {
        return baseClass + "bg-red-50 border-red-500 text-red-700";
      }
    }
    
    // Default
    return baseClass + "bg-white border-gray-200 text-gray-700";
  };

  // --- Tampilan Layar Hasil ---
  if (quizComplete) {
    const finalScore = calculateFinalScore();
    const totalPoints = questions.reduce((acc, q) => acc + q.poin, 0);
    const percentage = totalPoints > 0 ? Math.round((finalScore / totalPoints) * 100) : 0;
    
    const getMessage = () => {
      if (percentage === 100) return "Skor Sempurna! 🎉";
      if (percentage >= 80) return "Kerja Bagus! 🌟";
      if (percentage >= 60) return "Bagus! 👍";
      return "Terus Berlatih! 💪";
    };

    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
        <div className="w-full max-w-2xl p-12 mx-auto text-center bg-white shadow-lg rounded-2xl">
          <Trophy className="w-24 h-24 mx-auto mb-4 text-blue-600" />
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            {isSubmitting ? "Menyimpan Progres..." : getMessage()}
          </h2>
          
          {/* Tampilkan hasil setelah server merespons */}
          {!isSubmitting && (
            <>
              <div className="mb-8">
                <p className="mb-2 text-6xl font-bold text-blue-600">{percentage}%</p>
                <p className="text-xl text-gray-600">
                  Skor Anda: {finalScore} dari {totalPoints} total poin
                </p>
                {submitResult?.success && <p className="mt-2 text-green-600">Anda mendapatkan +{quizDetails.xp_reward} XP!</p>}
                {submitResult?.error && <p className="mt-2 text-red-500">{submitResult.error}</p>}
              </div>

              {/* ✅ FUNGSI KUNCI JAWABAN - Uncomment untuk aktifkan */}
              
              {/* <div className="mb-6">
                <button
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="px-6 py-3 text-sm font-medium text-blue-600 transition-all duration-200 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  {showAnswerKey ? "Sembunyikan Kunci Jawaban" : "Lihat Kunci Jawaban"}
                </button>
              </div> */}
              

              {/* ✅ REVIEW JAWABAN - Tampil saat showAnswerKey aktif */}
              {showAnswerKey && (
                <div className="mb-8 overflow-y-auto max-h-96">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">Review Semua Jawaban:</h3>
                  <div className="space-y-4 text-left">
                    {questions.map((q, index) => {
                      const userAnswerId = userAnswers[index];
                      const userChoice = q.PilihanKuis.find(choice => choice.jawaban_id === userAnswerId);
                      const correctChoice = q.PilihanKuis.find(choice => choice.score > 0);
                      const isCorrect = userChoice?.score && userChoice.score > 0;
                      
                      return (
                        <div key={q.pertanyaan_id} className="p-4 border rounded-lg bg-gray-50">
                          <p className="mb-2 font-medium text-gray-800">
                            {index + 1}. {q.teks_pertanyaan}
                          </p>
                          <p className={`text-sm mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            Jawaban Anda: {userChoice?.teks_jawaban || "Tidak dijawab"} 
                            {isCorrect ? " ✓" : " ✗"}
                          </p>
                          <p className="text-sm text-green-600">
                            Jawaban Benar: {correctChoice?.teks_jawaban}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Coba Kuis Lain
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- Tampilan Kuis Interaktif ---
  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-2 text-4xl font-bold text-center text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">
          {quizDetails.judul}
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Uji pengetahuanmu dan dapatkan {quizDetails.xp_reward} XP!
        </p>

        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </span>
            <span className="text-sm font-bold text-blue-600">
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="w-full max-w-2xl p-8 mx-auto bg-white shadow-lg rounded-2xl">
          {question.image && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <Image 
                src={question.image} 
                alt="Ilustrasi Pertanyaan" 
                width={600}
                height={256}
                className="object-cover w-full h-64" 
              />
            </div>
          )}
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">
            {question.teks_pertanyaan}
          </h2>

          <div className="space-y-3">
            {question.PilihanKuis.map((choice) => (
              <button
                key={choice.jawaban_id}
                className={getButtonClass(choice)}
                onClick={() => handleAnswer(choice)}
              >
                {choice.teks_jawaban}
              </button>
            ))}
          </div>
        </div>

        
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 text-sm font-medium text-gray-600 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          
          <span className="text-sm text-gray-500">
            {Object.keys(userAnswers).length} dari {questions.length} terjawab
          </span>
          
          <button
            onClick={handleNext}
            className="px-6 py-3 text-sm font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {currentQuestionIndex < questions.length - 1 ? "Selanjutnya →" : "Selesai"}
          </button>
        </div>
      </div>
    </div>
  );
}