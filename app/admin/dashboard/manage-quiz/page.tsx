"use client";

import { useState, ChangeEvent, useTransition } from "react";

type Question = {
  text: string;
  options: string[];
  answer: number;
};

export default function ManageQuizPage() {
  const [isPending, startTransition] = useTransition();
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: ["", "", "", ""], answer: 0 },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: "", options: ["", "", "", ""], answer: 0 },
    ]);
  };

  const handleChange = (
    qIndex: number,
    field: "text" | "answer" | "option",
    value: string,
    optIndex?: number
  ) => {
    setQuestions((prev) => {
      const newQs = [...prev];
      if (field === "text") {
        newQs[qIndex].text = value;
      } else if (field === "answer") {
        // Mengonversi nilai string dari select ke number
        newQs[qIndex].answer = parseInt(value, 10);
      } else if (field === "option" && optIndex !== undefined) {
        newQs[qIndex].options[optIndex] = value;
      }
      return newQs;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ judul, deskripsi, questions });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Buat Kuis Baru</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        <div>
          <label
            htmlFor="judul"
            className="block text-sm font-medium text-gray-700"
          >
            Judul Kuis
          </label>
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="deskripsi"
            className="block text-sm font-medium text-gray-700"
          >
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-md bg-gray-50">
            <label className="block font-semibold">
              Pertanyaan {qIndex + 1}
            </label>
            <input
              type="text"
              value={q.text}
              onChange={(e) => handleChange(qIndex, "text", e.target.value)}
              className="w-full px-3 py-2 my-2 border rounded"
              placeholder="Tulis pertanyaan di sini"
              required
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Opsi ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleChange(qIndex, "option", e.target.value, optIndex)
                  }
                  className="px-3 py-2 border rounded"
                  required
                />
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Jawaban Benar
              </label>
              <select
                value={q.answer}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleChange(qIndex, "answer", e.target.value)
                }
                className="px-3 py-2 border rounded bg-white"
              >
                {q.options.map((_, i) => (
                  <option key={i} value={i}>
                    {`Opsi ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded hover:bg-gray-200 transition-colors"
        >
          + Tambah Pertanyaan
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isPending ? "Menyimpan..." : "Simpan Kuis"}
        </button>
      </form>
    </div>
  );
}
