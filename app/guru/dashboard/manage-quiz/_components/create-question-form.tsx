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
import { Plus, Trash2, X, Save, Upload, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import Image from "next/image";
import { CreatePertanyaan, DeletePertanyaan } from "../lib/actions";

interface Option { id: string; text: string; score: number; }
interface Question {
  id: string;
  type: "pilihan_ganda" | "benar_salah";
  questionText: string;
  options: Option[];
  correctAnswer: string;
  image?: File | null;
  existingImageUrl?: string | null;
  isSaving?: boolean;
}

interface PilihanKuis {
  jawaban_id: number;
  pertanyaan_id: number | null;
  teks_jawaban: string;
  score: number;
}

interface PertanyaanKuis {
  pertanyaan_id: number;
  kuis_id: number | null;
  teks_pertanyaan: string;
  image?: string | null;
  tipe: string;
  poin: number;
  urutan: number;
  PilihanKuis: PilihanKuis[];
}

const STORAGE_KEY_PREFIX = "quiz-draft-";
let questionCounter = 1;
let optionCounter = 1;

const createNewQuestion = (): Question => {
  const questionId = `q_new_${questionCounter++}`;
  return {
    id: questionId,
    type: "pilihan_ganda",
    questionText: "",
    options: [
      { id: `o_new_${optionCounter++}`, text: "", score: 0 },
      { id: `o_new_${optionCounter++}`, text: "", score: 0 }
    ],
    correctAnswer: "",
    image: null,
  };
};

interface BuilderProps {
  quizId: number;
  initialQuestions: (PertanyaanKuis & { PilihanKuis: PilihanKuis[] })[];
  quizTitle: string;
  quizDescription?: string | null;
}

export default function CreateQuestionForm({ quizId, initialQuestions, quizTitle, quizDescription }: BuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const STORAGE_KEY = `${STORAGE_KEY_PREFIX}${quizId}`;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const mapInitialData = () => {
        if (initialQuestions && initialQuestions.length > 0) {
            return initialQuestions.map(q => {
                const correctOption = q.PilihanKuis.find(opt => opt.score > 0);
                let correctAnswerValue = "";
                if (q.tipe === 'benar_salah') {
                    correctAnswerValue = correctOption?.teks_jawaban.toLowerCase() === 'benar' ? 'true' : 'false';
                } else {
                    correctAnswerValue = correctOption?.jawaban_id.toString() || "";
                }

                return {
                  id: q.pertanyaan_id.toString(),
                  type: q.tipe as "pilihan_ganda" | "benar_salah",
                  questionText: q.teks_pertanyaan,
                  options: q.PilihanKuis.map(opt => ({
                    id: opt.jawaban_id.toString(),
                    text: opt.teks_jawaban,
                    score: opt.score ?? 0,
                  })) || [],
                  correctAnswer: correctAnswerValue,
                  image: null,
                  existingImageUrl: q.image || null,
                };
            });
        }
        return [createNewQuestion()];
    };

    const savedDraft = sessionStorage.getItem(STORAGE_KEY);
    let loadedQuestions: Question[] = [];
    if (savedDraft) {
        try {
            loadedQuestions = JSON.parse(savedDraft);
            if (!Array.isArray(loadedQuestions)) {
                console.error("Invalid draft format, resetting.");
                loadedQuestions = mapInitialData();
            }
        } catch (error) {
            console.error("Error parsing saved draft:", error);
            loadedQuestions = mapInitialData();
        }
    } else {
        loadedQuestions = mapInitialData();
    }

    setQuestions(loadedQuestions);
    setIsInitialized(true);
  }, [initialQuestions, STORAGE_KEY, isInitialized]);


  useEffect(() => {
     if (isInitialized) {
         sessionStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
     }
  }, [questions, STORAGE_KEY, isInitialized]);


  const addQuestion = (index: number) => {
    const newQ = [...questions];
    newQ.splice(index + 1, 0, createNewQuestion());
    setQuestions(newQ);
  };

  const addQuestionAtEnd = () => {
    setQuestions((prev) => [...prev, createNewQuestion()]);
  };

  const removeQuestion = (id: string) => {
    if (id.startsWith("q_new_")) {
        if (questions.length > 1) {
            setQuestions(prev => prev.filter(q => q.id !== id));
        } else {
            toast.info("Minimal harus ada satu pertanyaan.");
        }
        return;
    }

    setQuestions(prev => prev.map(q => q.id === id ? { ...q, isSaving: true } : q));

    startTransition(async () => {
      const res = await DeletePertanyaan(id);
      if (res?.error) {
        toast.error("Gagal Hapus", { description: res.error });
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, isSaving: false } : q));
      } else {
        toast.success("Pertanyaan dihapus!");
        setQuestions(prev => prev.filter(q => q.id !== id));
      }
    });
  };


  const updateQuestion = (id: string, field: keyof Question, value: any) => {
      setQuestions(prevQuestions => prevQuestions.map(q => {
          if (q.id === id) {
              const updatedQuestion = { ...q, [field]: value };

              if (field === "type") {
                  if (value === "pilihan_ganda") {
                      updatedQuestion.options = [
                          { id: `o_new_${optionCounter++}`, text: "", score: 0 },
                          { id: `o_new_${optionCounter++}`, text: "", score: 0 }
                      ];
                      updatedQuestion.correctAnswer = "";
                  } else {
                      updatedQuestion.options = [
                          { id: `o_new_${optionCounter++}`, text: "Benar", score: 0 },
                          { id: `o_new_${optionCounter++}`, text: "Salah", score: 0 }
                      ];
                      updatedQuestion.correctAnswer = "true";
                  }
              }
              else if (field === 'correctAnswer') {
                  if (q.type === 'pilihan_ganda') {
                      updatedQuestion.options = q.options.map(opt => ({
                          ...opt,
                          score: opt.id === value ? 10 : 0
                      }));
                  } else {
                      updatedQuestion.options = q.options.map(opt => ({
                          ...opt,
                          score: (opt.text.toLowerCase() === 'benar' && value === 'true') || (opt.text.toLowerCase() === 'salah' && value === 'false') ? 10 : 0
                      }));
                  }
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
      setQuestions(prevQuestions => prevQuestions.map(q => {
          if (q.id === qId) {
              const updatedOptions = q.options.map(opt =>
                  opt.id === oId ? { ...opt, score: score } : opt
              );
              const correctOptionId = q.type === 'pilihan_ganda' ? updatedOptions.find(opt => opt.score > 0)?.id || "" : q.correctAnswer;

              return { ...q, options: updatedOptions, correctAnswer: correctOptionId };
          }
          return q;
      }));
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map(q =>
      q.id === qId
        ? { ...q, options: [...q.options, { id: `o_new_${optionCounter++}`, text: "", score: 0 }] }
        : q
    ));
  };

  const removeOption = (qId: string, oId: string) => {
      setQuestions(prevQuestions => prevQuestions.map(q => {
          if (q.id === qId) {
              const updatedOptions = q.options.filter(opt => opt.id !== oId);
              const newCorrectAnswer = q.correctAnswer === oId ? "" : q.correctAnswer;
              return { ...q, options: updatedOptions, correctAnswer: newCorrectAnswer };
          }
          return q;
      }));
  };

  const handleImageChange = (qId: string, file: File | null) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
    }
    updateQuestion(qId, 'image', file);
    if (file) {
      updateQuestion(qId, 'existingImageUrl', null);
    }
  };

  const removeImage = (qId: string) => {
    updateQuestion(qId, 'image', null);
    updateQuestion(qId, 'existingImageUrl', null);
    const inputElement = document.getElementById(`image-${qId}`) as HTMLInputElement;
    if (inputElement) {
        inputElement.value = "";
    }
  };

  const handleSaveAllQuestions = () => {
    startTransition(async () => {
      const newQuestionsToSave = questions.filter(q => q.id.startsWith("q_new_"));

      if (newQuestionsToSave.length === 0) {
        toast.info("Tidak ada pertanyaan baru.", { description: "Semua pertanyaan sudah tersimpan." });
        router.push("/guru/dashboard/manage-quiz");
        return;
      }

      let hasError = false;
      const questionPromises = newQuestionsToSave.map(async (question, index) => {
          if (!question.questionText.trim()) {
              toast.error(`Pertanyaan #${index + 1 + initialQuestions.length} kosong.`);
              hasError = true;
              return null;
          }
          if (question.type === 'pilihan_ganda' || question.type === 'benar_salah') {
              if (question.options.some(opt => !opt.text.trim())) {
                  toast.error(`Ada opsi kosong di Pertanyaan #${index + 1 + initialQuestions.length}.`);
                  hasError = true;
                  return null;
              }
              if (!question.correctAnswer) {
                  toast.error(`Jawaban benar belum dipilih untuk Pertanyaan #${index + 1 + initialQuestions.length}.`);
                  hasError = true;
                  return null;
              }
               if (question.options.every(opt => opt.score <= 0)) {
                   toast.error(`Skor jawaban benar belum diatur (harus > 0) untuk Pertanyaan #${index + 1 + initialQuestions.length}.`);
                   hasError = true;
                   return null;
               }
          }

          if (hasError) return null;

          const formData = new FormData();
          formData.append("teks_pertanyaan", question.questionText);
          formData.append("tipe", question.type);
          formData.append("poin", "10");
          formData.append("urutan", (initialQuestions.length + index + 1).toString());

          if (question.image) {
            formData.append("image", question.image);
          } else {
            formData.append("image", "null");
          }

          let pilihanData: Array<{teks_jawaban: string; score: number}> = [];
          if (question.type === "pilihan_ganda" || question.type === "benar_salah") {
              pilihanData = question.options.map(opt => ({
                  teks_jawaban: opt.text,
                   score: (question.type === 'pilihan_ganda' && opt.id === question.correctAnswer) ||
                          (question.type === 'benar_salah' && ((opt.text.toLowerCase() === 'benar' && question.correctAnswer === 'true') || (opt.text.toLowerCase() === 'salah' && question.correctAnswer === 'false')))
                          ? 10 : 0
              }));
          }
          formData.append("pilihan", JSON.stringify(pilihanData));

          return CreatePertanyaan(quizId.toString(), formData);
      });

      if (hasError) {
          toast.warning("Beberapa pertanyaan belum valid.", { description: "Periksa kembali isian Anda." });
          return;
      }

      const results = await Promise.all(questionPromises.filter(p => p !== null));

      const errors = results.filter(res => res && res.error);
      const successes = results.filter(res => res && res.success);

      if (errors.length > 0) {
        toast.error(`${errors.length} pertanyaan gagal disimpan.`, { description: errors[0]?.error });
      }
      if (successes.length > 0) {
        toast.success(`${successes.length} pertanyaan baru berhasil disimpan!`);
        sessionStorage.removeItem(STORAGE_KEY);
        router.push("/guru/dashboard/manage-quiz");
        router.refresh();
      }
      if (successes.length === 0 && errors.length === 0) {
         toast.info("Tidak ada pertanyaan baru yang perlu disimpan.");
         router.push("/guru/dashboard/manage-quiz");
      }
    });
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[300px]">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200 rounded-lg shadow-sm">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800">{quizTitle}</h2>
            {quizDescription && <p className="mt-1 text-gray-600">{quizDescription}</p>}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Total pertanyaan: {questions.length}</div>
          <Button onClick={addQuestionAtEnd} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Tambah Pertanyaan
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <React.Fragment key={q.id}>
              <Card className={`overflow-hidden transition-shadow duration-200 bg-white border rounded-lg shadow-sm hover:shadow-md ${q.isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
                <CardContent className="p-0">
                  <div className="p-5 border-b md:p-6 border-gray-100">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start flex-1 gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">{index + 1}</div>
                        <Textarea
                          placeholder="Tulis pertanyaan Anda..."
                          value={q.questionText}
                          onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)}
                          className="flex-1 text-base font-medium border-none p-0 bg-transparent focus-visible:ring-0 resize-none text-gray-900 placeholder:text-gray-400 min-h-[40px]"
                          rows={1}
                        />
                      </div>
                      <div className="flex items-center self-start gap-2 md:self-auto">
                        <Select value={q.type} onValueChange={(value: "pilihan_ganda" | "benar_salah") => updateQuestion(q.id, 'type', value)}>
                          <SelectTrigger className="w-full md:w-[160px] h-9 border-gray-300 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg">
                            <SelectItem value="pilihan_ganda" className="text-sm">Pilihan Ganda</SelectItem>
                            <SelectItem value="benar_salah" className="text-sm">Benar / Salah</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-4 pl-11">
                      {(q.image || q.existingImageUrl) ? (
                        <div className="relative inline-block group">
                          <div className="relative w-32 h-24 overflow-hidden border rounded-lg">
                            <Image
                              src={q.image ? URL.createObjectURL(q.image) : q.existingImageUrl!}
                              alt="Preview gambar"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute z-10 w-6 h-6 transition-opacity opacity-0 -top-2 -right-2 group-hover:opacity-100"
                            onClick={() => removeImage(q.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                           <div className="mt-2">
                             <Label
                               htmlFor={`image-${q.id}`}
                               className="inline-flex items-center gap-2 px-3 py-1 text-xs text-gray-600 transition-colors border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                             >
                               <Upload className="w-3 h-3" />
                               Ganti
                             </Label>
                             <Input
                               id={`image-${q.id}`} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
                               onChange={(e) => { const file = e.target.files?.[0] || null; handleImageChange(q.id, file); }}
                             />
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`image-${q.id}`}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <Upload className="w-4 h-4" />
                            Gambar (Opsional)
                          </Label>
                          <Input
                            id={`image-${q.id}`} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
                            onChange={(e) => { const file = e.target.files?.[0] || null; handleImageChange(q.id, file); }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 md:p-6 pl-16">
                    {q.type === 'pilihan_ganda' && (
                      <div className="space-y-4">
                        <RadioGroup value={q.correctAnswer} onValueChange={(val) => updateQuestion(q.id, 'correctAnswer', val)} className="space-y-3">
                          {q.options.map((opt, optIndex) => (
                            <div key={opt.id} className="flex items-center gap-3 group">
                              <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} className="flex-shrink-0 mt-1"/>
                              <Input
                                value={opt.text}
                                onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                                placeholder={`Opsi ${optIndex + 1}`}
                                className="flex-1 h-auto px-0 py-1 text-sm bg-transparent border-0 border-b border-gray-200 rounded-none focus-visible:ring-0 focus-visible:border-blue-500"
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
                        <Button variant="ghost" size="sm" className="h-auto p-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => addOption(q.id)}>
                          <Plus className="w-3 h-3 mr-1" /> Tambah Opsi
                        </Button>
                      </div>
                    )}
                    {q.type === 'benar_salah' && (
                      <RadioGroup value={q.correctAnswer} onValueChange={(val) => updateQuestion(q.id, 'correctAnswer', val)} className="space-y-3">
                        {q.options.map((opt) => (
                          <div key={opt.id} className="flex items-center gap-3 group">
                            <RadioGroupItem value={opt.text.toLowerCase() === "benar" ? "true" : "false"} id={`${q.id}-${opt.id}`} />
                            <Label htmlFor={`${q.id}-${opt.id}`} className="font-medium text-gray-700">{opt.text}</Label>
                             <Input
                               type="number"
                               value={opt.score}
                               min={0}
                               onChange={(e) => updateOptionScore(q.id, opt.id, Number(e.target.value))}
                               placeholder="Nilai"
                               className="w-20 h-8 text-sm border-gray-300 ml-auto"
                             />
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>

                  <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} disabled={questions.length <= 1 || isPending} className="text-gray-500 w-9 h-9 hover:text-red-600 hover:bg-red-50">
                            {q.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Hapus Pertanyaan</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center my-[-12px] relative z-10">
                <Tooltip>
                 <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="w-8 h-8 text-gray-500 bg-white border-gray-300 rounded-full shadow-sm hover:bg-gray-50" onClick={() => addQuestion(index)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>Tambah Pertanyaan Di Sini</p></TooltipContent>
                </Tooltip>
              </div>

            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Button size="lg" onClick={handleSaveAllQuestions} disabled={isPending} className="px-8 py-3 font-medium rounded-lg shadow-sm">
            <Save className="w-5 h-5 mr-2" />
            {isPending ? "Menyimpan..." : "Simpan Semua Pertanyaan"}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}