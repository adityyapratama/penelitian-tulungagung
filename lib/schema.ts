import { z } from "zod"

export const schemaSignIn = z.object({
	email: z
		.string({ message: "Email is required" }),
	password: z
		.string({ message: "Password is required" })
		.min(5, { message: "Password should have min 5 characters" }),
});

export const SchemaRegister = z.object({
	username: z.string({message:"Username is required."}).min(5,{message:"Username should have min 5 characters"}),
	email: z.string({message: "Email is required"}).email({message:"Format should have @email"}),
	password: z.string({message:"Password is required"}).min(8,{message:"Password shoul have min 8 characters"})
})

export const SchemaUser = z.object({
	username: z.string({message:"Username is required."}).min(5,{message:"Username should have min 5 characters"}),
	email: z.string({message: "Email is required"}).email({message:"Format should have @email"}),
	password: z.string({message:"Password is required"}).min(8,{message:"Password shoul have min 8 characters"}),
	role: z.enum(["member","guru","super_admin"])
})

export const SchemaArticle = z.object({
	judul: z.string({message:"Judul is required"}).min(8,{message:"Judul should have min 8 characters"}),
	konten: z.string({message:"Konten is required"}).min(100,{message:"Konten shoul have min 100 characters"}),
	kategori:z.bigint({message:"Kategori is required"}),
	thumbnail:z.instanceof(File)
})

export const SchemaSekolah = z.object({
	nama_sekolah: z.string({message:"Nama Sekolah is required"}),
	alamat_sekolah : z.string({
		message:"Alamat Sekolah is required"
	})
})