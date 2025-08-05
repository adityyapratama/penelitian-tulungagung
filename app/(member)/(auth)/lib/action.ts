"use server"

import { schemaSignIn } from "@/lib/schema"
import { AuthError } from "next-auth"
import { signIn as authSignIn } from "@/auth" // kalau pakai Auth.js v5+
import { redirect } from "next/navigation"
import { ActionResult } from "@/types"

export async function signInAction(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = schemaSignIn.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validate.success) {
    return {
      error: validate.error.message,
    }
  }

  try {
    await authSignIn("credentials", {
      email: validate.data.email,
      password: validate.data.password,
      redirect: false,
    })

    return redirect("/")
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid credentials" }
    }
    return { error: "Unexpected error" }
  }
}
