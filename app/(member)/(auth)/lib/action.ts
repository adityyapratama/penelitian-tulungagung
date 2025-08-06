"use server"

import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export async function handleLogin(
  _: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  })

  if (result?.error) {
    return { error: "Email atau password salah" }
  }

  redirect("/") // redirect manual jika berhasil
}
