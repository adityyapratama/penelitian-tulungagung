import { z } from "zod";

const myBooleanSchema = z.preprocess(
  (val) => val === 'true' || val === '1',
  z.boolean({ message: "publish option is required" })
);

export const schemaSignIn = z.object({
  email: z.string({ message: "Email is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(5, { message: "Password should have min 5 characters" }),
});

export const SchemaRegister = z.object({
  username: z
    .string({ message: "Username is required." })
    .min(5, { message: "Username should have min 5 characters" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Format should have @email" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password shoul have min 8 characters" }),
});

export const SchemaUser = z.object({
  username: z
    .string({ message: "Username is required." })
    .min(5, { message: "Username should have min 5 characters" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Format should have @email" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password shoul have min 8 characters" }),
  role: z.enum(["member", "guru", "super_admin"]),
});

export const SchemaArticle = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  konten: z
    .string({ message: "Konten is required" })
    .min(100, { message: "Konten shoul have min 100 characters" }),
  kategori: z.coerce.bigint({ message: "Kategori is required" }),
  thumbnail: z.instanceof(File),
});

export const SchemaSekolah = z.object({
  nama_sekolah: z.string({ message: "Nama Sekolah is required" }),
  alamat_sekolah: z.string({
    message: "Alamat Sekolah is required",
  }),
});

export const SchemaQuiz = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  deskripsi: z.string({ message: "deskripsi is required" }),
  kategori_id: z.number({ message: "kategori is required" }).int().min(1),
  xp_reward: z.number({ message: "xp reward is required" }).int(),
  is_published: myBooleanSchema,
  thumbnail: z.instanceof(File),
});

export const SchemaPilihan = z.object({
  teks_jawaban: z.string().min(1, "Jawaban wajib diisi"),
  score: z.number().int().default(0),
});

export const SchemaPertanyaan = z.object({
  teks_pertanyaan: z.string().min(1, "Pertanyaan wajib diisi"),
  tipe: z.enum(["pilihan_ganda", "benar_salah"]),
  poin: z.number().int().default(10),
  urutan: z.number().int(),
  pilihan: z.array(SchemaPilihan),
  image : z.instanceof(File).optional()
});

export const SchemaStory = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  thumbnail: z.instanceof(File),
  category: z.string({ message: "category is required" }),
  deskripsi: z.string({ message: "deskripsi is required" }),
  xp_reward: z.number({ message: "xp reward is required" }).int(),
  is_published: myBooleanSchema
});

export const SchemaCategoryKuis = z.object({
  nama_kategori: z
    .string({ message: "nama kategori is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  deskripsi: z.string({ message: "deskripsi is required" }),
  thumbnail: z.instanceof(File).optional(),
});

export const SchemaCategoryKuisUpdate = z.object({
  nama_kategori: z
    .string({ message: "nama kategori is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  deskripsi: z.string({ message: "deskripsi is required" }),
  thumbnail: z.instanceof(File).optional(),
});

export const SchemaStoryCategory = z.object({
  NamaKategori: z
    .string({ message: "nama kategori is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
});

export const SchemaPuzzle = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  gambar: z.instanceof(File),
  kategori: z.enum([
    "Tempat_Wisata",
    "Tokoh_Sejarah",
    "Peta",
    "Budaya",
    "Lainnya",
  ]),
  xp_reward: z.coerce
    .number({
      required_error: "xp reward is required",
      invalid_type_error: "xp reward harus berupa angka",
    })
    .int({ message: "xp reward harus berupa bilangan bulat" }),
  is_published: myBooleanSchema
});

export const SchemaMember = z.object(
  {
    sekolah_id: z.string({message:"sekolah is required"}),
    nis: z.string({message:"nis is required"}),
    foto_profile: z.instanceof(File),
    bio: z.string({message: "bio is required"}),
    tanggal_lahir : z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid",
    })
    .transform((val) => new Date(val)),
    jenis_kelamin: z.enum(["L","P","Lainnya"]),
    minat: z.string({message:"message:required"}),
  }
)
  
