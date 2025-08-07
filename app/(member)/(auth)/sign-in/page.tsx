'use client'

import { useActionState } from "react"
import { handleLogin } from "../lib/action"


export default function SignInPage() {

  const [state, formAction] = useActionState(handleLogin, null)
  
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
