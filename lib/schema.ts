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