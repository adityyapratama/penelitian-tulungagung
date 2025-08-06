"use client"

import { useActionState } from "react"
import { handleLogin } from "../lib/action"

const initialState = { error: null }

export default function SignInForm() {
  const [state, formAction] = useActionState(handleLogin, initialState)

  return (
    <form action={formAction}>
      <input name="email" />
      <input name="password" />
      <button type="submit">Login</button>
      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  )
}
