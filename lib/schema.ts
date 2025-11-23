import { z } from "zod";

// Helper for file validation that works on both client and server
const fileSchema = z.any().refine(
  (file) => {
    // On client side, check if it's a File instance
    if (typeof File !== 'undefined' && file instanceof File) return true;
    // On server side, allow any value (will be validated during form processing)
    if (typeof File === 'undefined') return true;
    return false;
  },
  { message: "Invalid file" }
);


const optionalFileSchema = z.any().optional();

const myBooleanSchema = z.preprocess(
  (val) => val === 'true' || val === '1',
  z.boolean({ message: "Publish option is required" })
);

const nullableNumberParam = z.coerce
  .number()
  .transform((val) => (val === 0 ? null : val))
  .nullable()
  .optional();

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
    .min(8, { message: "Password should have min 8 characters" }),
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
    .min(8, { message: "Password should have min 8 characters" }),
  role: z.enum(["member", "guru", "super_admin"]),
});

export const SchemaArticle = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  konten: z
    .string({ message: "Konten is required" })
    .min(100, { message: "Konten should have min 100 characters" }),
  kategori: z.coerce.bigint({ message: "Kategori is required" }),
  thumbnail: fileSchema,
});

export const SchemaSekolah = z.object({
  nama_sekolah: z.string({ message: "Nama Sekolah is required" }),
  alamat_sekolah: z.string({
    message: "Alamat Sekolah is required",
  }),
});

export const SchemaQuiz = z.object({
  judul: z
    .string({ required_error: "Judul cannot be null" }) 
    .min(1, { message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" })
    .max(100, { message: "Judul cannot be more 100 characters" }),
  deskripsi: z.string().optional(), 
  kategori_id: nullableNumberParam,
  xp_reward: z.coerce
    .number({ message: "XP Reward is required" })
    .int()
    .min(1, { message: "XP Reward is required" }),
  is_published: myBooleanSchema,
  thumbnail: fileSchema,
});

export const SchemaQuizUpdate = z.object({
  judul: z
    .string({ required_error: "Judul cannot be null" }) 
    .min(1, { message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" })
    .max(100, { message: "Judul cannot be more 100 characters" }),
  deskripsi: z.string().optional(),
  kategori_id: nullableNumberParam,
  xp_reward: z.coerce
    .number({ message: "XP Reward is required" })
    .int()
    .min(1, { message: "XP Reward is required" }),
  is_published: myBooleanSchema,
  thumbnail: optionalFileSchema, 
});

export const SchemaPilihan = z.object({
  teks_jawaban: z.string().min(1, "Jawaban is required"),
  score: z.number().int().default(0),
});

export const SchemaPertanyaan = z.object({
  teks_pertanyaan: z.string().min(1, "Pertanyaan is required"),
  tipe: z.enum(["pilihan_ganda", "benar_salah"]),
  poin: z.number().int().default(10),
  urutan: z.number().int(),
  pilihan: z.array(SchemaPilihan),
  image : optionalFileSchema
});

export const SchemaStory = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  thumbnail: fileSchema,
  category: z.string({ message: "Category is required" }),
  deskripsi: z.string({ message: "Deskripsi is required" }),
  xp_reward: z.number({ message: "Xp reward is required" }).int(),
  is_published: myBooleanSchema
});

export const SchemaStoryUpdate = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  thumbnail: optionalFileSchema, 
  category: z.string({ message: "Category is required" }),
  deskripsi: z.string({ message: "Deskripsi is required" }),
  xp_reward: z.number({ message: "Xp reward is required" }).int(),
  is_published: myBooleanSchema
});

export const SchemaCategoryKuis = z.object({
  nama_kategori: z
    .string({ required_error: "Nama kategori cannot be null" }) 
    .min(1, { message: "Nama kategori is required" }) 
    .min(5, { message: "Nama kategori should have min 5 karakter" })
    .max(50, { message: "Nama kategori cannot be more than 50 character" }),
  deskripsi: z.string({ message: "Deskripsi is required" }),
  thumbnail: optionalFileSchema,
});

export const SchemaCategoryKuisUpdate = z.object({
  nama_kategori: z
    .string({ message: "Nama kategori is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  deskripsi: z.string({ message: "Deskripsi is required" }),
  thumbnail: optionalFileSchema,
});

export const SchemaStoryCategory = z.object({
  NamaKategori: z
    .string({ message: "Nama kategori is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
});

export const SchemaPuzzle = z.object({
  judul: z
    .string({ message: "Judul is required" })
    .min(8, { message: "Judul should have min 8 characters" }),
  gambar: fileSchema,
  thumbnail : fileSchema,
  kategori: z.enum([
    "Tempat_Wisata",
    "Tokoh_Sejarah",
    "Peta",
    "Budaya",
    "Lainnya",
  ]),
  xp_reward: z.coerce
    .number({
      required_error: "Xp reward is required",
      invalid_type_error: "Xp reward must be a number",
    })
    .int({ message: "Xp reward must be an int" }),
  is_published: myBooleanSchema
});

export const SchemaMember = z.object(
  {
    sekolah_id: z.string({message:"Sekolah is required"}),
    nis: z.string({message:"Nis is required"}),
    foto_profile: fileSchema,
    bio: z.string({message: "Bio is required"}),
    tanggal_lahir : z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
    jenis_kelamin: z.enum(["L","P","Lainnya"]),
    minat: z.string({message:"message:required"}),
  }
)

export const SchemaGroup = z.object(
  {
    group_name : z.string({message:"Group should have a name"}),
    group_thumbnail : optionalFileSchema
  }
)


export const SchemaGroupContent = z.object({
  group_id: z.string({ message: "Group should have id" }),
  contents: z.array(
    z.object({
      content_type: z.enum(["kuis", "cerita", "puzzle"]),
      content_id: z.coerce.number().int().min(0),
    })
  ).min(1, "Please select at least one content item."),
});

export const SchemaGuru = z.object({
  user_id: z.string({ message: "User not found" }),
  sekolah_id: z.string({ message: "Sekolah not found" }),
  nip: z.string({ message: "Invalid NIP" })
        .min(18, { message: "NIP must be at least 18 digits" })
        .max(20, { message: "NIP must be at most 20 digits" }), 
  bidang_ajar: z.string({ message: "Bidang ajar is required" })
});