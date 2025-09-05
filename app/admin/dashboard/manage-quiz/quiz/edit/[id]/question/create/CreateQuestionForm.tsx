"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, X, Save } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { PertanyaanKuis, PilihanKuis } from "@prisma/client";
import { CreatePertanyaan, DeletePertanyaan } from "@/app/admin/dashboard/manage-quiz/lib/actions";

// --- TIPE DATA & FUNGSI BANTUAN ---
interface Option { id: string; text: string; score: number; }
interface Question {
  id: string;
  type: "pilihan_ganda" | "benar_salah";
  questionText: string;
  options: Option[];
  correctAnswer: string;
}
const STORAGE_KEY_PREFIX = "quiz-draft-";
const createNewQuestion = (): Question => ({
  id: `q_${Date.now()}`,
  type: "pilihan_ganda",
  questionText: "",
  options: [
    { id: `o_${Date.now() + 1}`, text: "", score: 0 },
    { id: `o_${Date.now() + 2}`, text: "", score: 0 }
  ],
  correctAnswer: "",
});

// --- PROPS ---
interface BuilderProps {
  quizId: number;
  initialQuestions: (PertanyaanKuis & { PilihanKuis: PilihanKuis[] })[];
  quizTitle: string;
  quizDescription?: string | null;
}

// --- KOMPONEN UTAMA ---
export default function DynamicQuestionBuilder({ quizId, initialQuestions, quizTitle, quizDescription }: BuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const STORAGE_KEY = `${STORAGE_KEY_PREFIX}${quizId}`;

  // State Tunggal untuk semua pertanyaan
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return initialQuestions.map(q => {
        const correctOption = q.PilihanKuis.find(opt => opt.score > 0);
        return {
          id: q.pertanyaan_id.toString(),
          type: q.tipe,
          questionText: q.teks_pertanyaan,
          options: q.PilihanKuis.map(opt => ({
            id: opt.jawaban_id.toString(),
            text: opt.teks_jawaban,
            score: opt.score ?? 0,
          })) || [],
          correctAnswer: q.tipe === 'benar_salah'
            ? (correctOption?.teks_jawaban.toLowerCase() === 'benar' ? 'true' : 'false')
            : (correctOption?.jawaban_id.toString() || ""),
        };
      });
    }
    if (typeof window !== "undefined") {
      const savedDraft = sessionStorage.getItem(STORAGE_KEY);
      if (savedDraft) return JSON.parse(savedDraft);
    }
    return [createNewQuestion()];
  });

  // Efek untuk menyimpan draft ke sessionStorage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions, STORAGE_KEY]);

  // Handler function
  const addQuestion = (index: number) => {
    const newQ = [...questions];
    newQ.splice(index + 1, 0, createNewQuestion());
    setQuestions(newQ);
  };

  // Hapus pertanyaan: jika baru, hapus dari state; jika lama, hapus dari DB dan state
  const removeQuestion = (id: string) => {
    if (id.startsWith("q_")) {
      if (questions.length > 1) {
        setQuestions(questions.filter(q => q.id !== id));
      }
    } else {
      startTransition(async () => {
        const res = await DeletePertanyaan(id);
        if (res?.error) {
          toast.error("Gagal menghapus soal!");
        } else {
          toast.success("Soal berhasil dihapus!");
          setQuestions(questions.filter(q => q.id !== id));
        }
      });
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const updatedQuestion = { ...q, [field]: value };
        if (field === "type") {
          updatedQuestion.options = value === "pilihan_ganda"
            ? [
                { id: `o_${Date.now() + 1}`, text: "", score: 0 },
                { id: `o_${Date.now() + 2}`, text: "", score: 0 }
              ]
            : [
                { id: `o_${Date.now() + 1}`, text: "Benar", score: 0 },
                { id: `o_${Date.now() + 2}`, text: "Salah", score: 0 }
              ];
          updatedQuestion.correctAnswer = value === "benar_salah" ? "true" : "";
        }
        return updatedQuestion;
      }
      return q;
    }));
  };

  const updateOptionText = (qId: string, oId: string, text: string) => {
    setQuestions(questions.map(q =>
      q.id === qId
        ? { ...q, options: q.options.map(opt => opt.id === oId ? { ...opt, text } : opt) }
        : q
    ));
  };
  const updateOptionScore = (qId: string, oId: string, score: number) => {
    setQuestions(questions.map(q =>
      q.id === qId
        ? { ...q, options: q.options.map(opt => opt.id === oId ? { ...opt, score } : opt) }
        : q
    ));
  };
  const addOption = (qId: string) => {
    setQuestions(questions.map(q =>
      q.id === qId
        ? { ...q, options: [...q.options, { id: `o_${Date.now()}`, text: "", score: 0 }] }
        : q
    ));
  };
  const removeOption = (qId: string, oId: string) => {
    setQuestions(questions.map(q =>
      q.id === qId
        ? { ...q, options: q.options.filter(opt => opt.id !== oId) }
        : q
    ));
  };

  // handler sumbit
  const handleSaveAllQuestions = () => {
    startTransition(async () => {
      // logika sumbit di backend
      const newQuestions = questions.filter(q => q.id.startsWith("q_"));
      if (newQuestions.length === 0) {
        toast.info("Tidak ada pertanyaan baru untuk disimpan.");
        router.push("/admin/dashboard/manage-quiz/quiz"); // Redirect meski tidak ada pertanyaan baru
        return;
      }
      const questionPromises = newQuestions.map((question, index) => {
        const formData = new FormData();
        formData.append("teks_pertanyaan", question.questionText);
        formData.append("tipe", question.type);
        formData.append("urutan", (initialQuestions.length + index + 1).toString());
        let pilihanData = [];
        if (question.type === "pilihan_ganda" || question.type === "benar_salah") {
          pilihanData = question.options.map(opt => ({
            teks_jawaban: opt.text,
            score: opt.score,
          }));
        }
        formData.append("pilihan", JSON.stringify(pilihanData));
        return CreatePertanyaan(quizId.toString(), formData);
      });
      const results = await Promise.all(questionPromises);
      const firstError = results.find(res => res && res.error);
      if (firstError) {
        toast.error(`Gagal menyimpan: ${firstError.error}`);
      } else {
        toast.success(`${results.length} pertanyaan baru berhasil disimpan!`);
        sessionStorage.removeItem(STORAGE_KEY);
        router.push("/admin/dashboard/manage-quiz/quiz"); // Redirect setelah submit sukses
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Quiz Header Card */}
        <Card className="overflow-hidden bg-gray-900 border border-gray-200 rounded-lg shadow-sm">
          <div className="h-3 bg-gradient-to-r from-white to-gray-200"></div>
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-white">{quizTitle}</h2>
            <p className="mt-2 text-base text-white">{quizDescription}</p>
          </CardContent>
        </Card>

        {/* Daftar Pertanyaan Dinamis */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <React.Fragment key={q.id}>
              <Card className="overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <CardContent className="p-0">
                  {/* Header Pertanyaan */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center flex-1 gap-3">
                        <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">{index + 1}</div>
                        <Textarea
                          placeholder="Tulis pertanyaan Anda..."
                          value={q.questionText}
                          onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)}
                          className="flex-1 text-lg font-medium border-none p-0 bg-transparent focus-visible:ring-0 resize-none text-gray-900 placeholder:text-gray-400 min-h-[32px]"
                          rows={1}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={q.type} onValueChange={(value: "pilihan_ganda" | "benar_salah") => updateQuestion(q.id, 'type', value)}>
                          <SelectTrigger className="w-[160px] h-9 border-gray-300 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg">
                            <SelectItem value="pilihan_ganda" className="text-sm">Pilihan Ganda</SelectItem>
                            <SelectItem value="benar_salah" className="text-sm">Benar / Salah</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Konten Pertanyaan (Opsi Jawaban) */}
                  <div className="p-6">
                    {q.type === 'pilihan_ganda' && (
                      <div className="space-y-4">
                        <RadioGroup value={q.correctAnswer} onValueChange={(val) => updateQuestion(q.id, 'correctAnswer', val)} className="space-y-3">
                          {q.options.map((opt, optIndex) => (
                            <div key={opt.id} className="flex items-center gap-3 group">
                              <RadioGroupItem value={opt.id} id={opt.id} className="flex-shrink-0 mt-1 text-blue-600 border-gray-300"/>
                              <Input
                                value={opt.text}
                                onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                                placeholder={`Opsi ${optIndex + 1}`}
                                className="flex-1 px-0 pb-2 transition-colors border-b border-gray-200 border-none rounded-none focus-visible:ring-0 focus-visible:border-blue-500"
                              />
                              <Input
                                type="number"
                                value={opt.score}
                                min={0}
                                onChange={(e) => updateOptionScore(q.id, opt.id, Number(e.target.value))}
                                placeholder="Nilai"
                                className="w-20 h-8 text-sm border-gray-300"
                              />
                              {q.options.length > 1 && (
                                <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 transition-opacity opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50" onClick={() => removeOption(q.id, opt.id)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                        <Button variant="ghost" className="h-auto p-2 font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => addOption(q.id)}>
                          <Plus className="w-4 h-4 mr-2" /> Tambah Opsi
                        </Button>
                      </div>
                    )}
                    {q.type === 'benar_salah' && (
                      <RadioGroup value={q.correctAnswer} onValueChange={(val) => updateQuestion(q.id, 'correctAnswer', val)} className="space-y-3">
                        {q.options.map((opt, optIndex) => (
                          <div key={opt.id} className="flex items-center gap-3 group">
                            <RadioGroupItem value={opt.text.toLowerCase() === "benar" ? "true" : "false"} id={opt.id} className="text-blue-600 border-gray-300"/>
                            <Label htmlFor={opt.id} className="font-medium text-gray-700">{opt.text}</Label>
                            <Input
                              type="number"
                              value={opt.score}
                              min={0}
                              onChange={(e) => updateOptionScore(q.id, opt.id, Number(e.target.value))}
                              placeholder="Nilai"
                              className="w-20 h-8 text-sm border-gray-300"
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>

                  {/* Footer Pertanyaan (Hapus) */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} disabled={questions.length <= 1} className="text-gray-500 w-9 h-9 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Hapus Pertanyaan</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tombol Tambah Pertanyaan di Antara Kartu */}
              <div className="flex justify-center">
                <Button variant="outline" className="text-gray-700 bg-white border-gray-300 rounded-full shadow-sm hover:bg-gray-50" onClick={() => addQuestion(index)}>
                  <Plus className="w-4 h-4 mr-2" /> Tambah Pertanyaan
                </Button>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Tombol Simpan Final */}
        <div className="flex justify-center pt-8">
          <Button size="lg" onClick={handleSaveAllQuestions} disabled={isPending} className="px-8 py-3 font-medium text-white bg-black rounded-lg shadow-sm hover:bg-gray-700">
            <Save className="w-5 h-5 mr-2" />
            {isPending ? "Menyimpan..." : "Simpan Semua Pertanyaan"}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}