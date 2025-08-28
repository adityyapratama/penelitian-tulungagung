// "use client"

// import { useState, ChangeEvent, useTransition } from "react"
// import { CreateQuiz } from "./lib/actions" // sesuaikan path

// // tipe Question
// type Question = {
//   text: string
//   options: string[]
//   answer: number
// }

// export default function ManageQuizPage() {
//   const [isPending, startTransition] = useTransition()
//   const [judul, setJudul] = useState("")
//   const [deskripsi, setDeskripsi] = useState("")
//   const [questions, setQuestions] = useState<Question[]>([
//     { text: "", options: ["", "", "", ""], answer: 0 }
//   ])

//   // tambah pertanyaan baru
//   const addQuestion = () => {
//     setQuestions(prev => [
//       ...prev,
//       { text: "", options: ["", "", "", ""], answer: 0 }
//     ])
//   }

//   // handler untuk perubahan input
//   const handleChange = (
//     qIndex: number,
//     field: "text" | "answer" | "option",
//     value: string,
//     optIndex?: number
//   ) => {
//     setQuestions(prev => {
//       const newQs = [...prev]
//       if (field === "text") {
//         newQs[qIndex].text = value
//       } else if (field === "answer") {
//         newQs[qIndex].answer = Number(value)
//       } else if (field === "option" && optIndex !== undefined) {
//         newQs[qIndex].options[optIndex] = value
//       }
//       return newQs
//     })
//   }

//   // handler untuk submit form
//   const handleSubmit = async () => {
//     const quizData = {
//       judul,
//       deskripsi,
//       questions
//     }
//     // Memanggil server action dengan data dari state
//     await CreateQuiz(quizData)
//   }

//   return (
//     <div className="max-w-2xl p-6 mx-auto bg-white shadow rounded-xl">
//       <h1 className="mb-4 text-2xl font-bold">Tambah Quiz</h1>

//       <form
//         action={() => startTransition(() => handleSubmit())}
//         className="flex flex-col gap-6"
//       >
//         {/* Input Quiz Info */}
//         <div>
//           <label className="block mb-1">Judul</label>
//           <input
//             type="text"
//             value={judul}
//             onChange={e => setJudul(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Deskripsi</label>
//           <textarea
//             value={deskripsi}
//             onChange={e => setDeskripsi(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>

//         {/* Dynamic Questions */}
//         <h2 className="mt-4 text-lg font-semibold">Pertanyaan</h2>
//         {questions.map((q, qIndex) => (
//           <div key={qIndex} className="p-4 mb-3 border rounded">
//             <label className="block mb-1">Pertanyaan {qIndex + 1}</label>
//             <input
//               type="text"
//               value={q.text}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 handleChange(qIndex, "text", e.target.value)
//               }
//               className="w-full px-3 py-2 mb-2 border rounded"
//               required
//             />

//             <div className="grid grid-cols-2 gap-2">
//               {q.options.map((opt, optIndex) => (
//                 <input
//                   key={optIndex}
//                   type="text"
//                   value={opt}
//                   placeholder={`Opsi ${optIndex + 1}`}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                     handleChange(qIndex, "option", e.target.value, optIndex)
//                   }
//                   className="px-3 py-2 border rounded"
//                   required
//                 />
//               ))}
//             </div>

//             <div className="mt-2">
//               <label className="block">Jawaban Benar</label>
//               <select
//                 value={q.answer}
//                 onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//                   handleChange(qIndex, "answer", e.target.value)
//                 }
//                 className="px-3 py-2 border rounded"
//               >
//                 {q.options.map((_, i) => (
//                   <option key={i} value={i}>
//                     {`Opsi ${i + 1}`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={addQuestion}
//           className="w-full px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200"
//         >
//           + Tambah Pertanyaan
//         </button>

//         <button
//           type="submit"
//           disabled={isPending}
//           className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
//         >
//           {isPending ? "Menyimpan..." : "Simpan Quiz"}
//         </button>
//       </form>
//     </div>
//   )
// }
