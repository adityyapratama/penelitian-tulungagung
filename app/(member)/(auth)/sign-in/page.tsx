"use client"

import { signInAction } from "../lib/action"
import { useActionState } from "react"


const initialState = { error: "" }
 
export default function Page() {
  const [state, formAction] = useActionState(signInAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label>Email</label>
        <input type="email" name="email" className="input" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" name="password" className="input" required />
      </div>

      {state.error && <p className="text-red-500">{state.error}</p>}

      <button type="submit" className="btn">Login</button>
    </form>
  )
}