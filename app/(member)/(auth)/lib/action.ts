'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function handleLogin(_: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try{
  const result = await signIn("credentials", {
    email,
    password,
    redirectTo:"/" ,
  })
  }catch(error){
    if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: 'Invalid credentials',
                    }
                default:
                    return {
                        message: 'Something went wrong.',
                    }
            }
        }
        throw error;
  }
}
