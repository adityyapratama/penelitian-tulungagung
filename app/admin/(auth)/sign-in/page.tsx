'use client'

import { useActionState } from "react"
import { handleLogin } from "./lib/actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function SignInPage() {

  const [state, formAction] = useActionState(handleLogin, null)
  const session = await auth()

  if (session?.user) redirect("/")
  
  return (
    <form action={formAction}>
      <input type="text" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>

      {state?.message && (
        <p style={{ color: 'red' }}>{state.message}</p>
      )}
    </form>
  )
}
