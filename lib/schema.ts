import { z } from "zod"

export const schemaSignIn = z.object({
	email: z
		.string({ message: "Email is required" }),
	password: z
		.string({ message: "Password is required" })
		.min(5, { message: "Password should have min 5 characters" }),
});