import NextAuth, { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb } from "./lib/utils"
import { saltAndHashPassword } from "./lib/utils"
import { schemaSignIn } from "./lib/schema"
import { ZodError } from "zod"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {label:"email",type:"text"},
        password: {label:"password",type:"password"},
      },
      authorize: async (credentials) => {
      try {
          let user = null
 
          const { email, password } = await schemaSignIn.parseAsync(credentials)
     
          user = await getUserFromDb(email, password)
          
          if (!user) {
            throw new Error("Invalid credentials.")
          }
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          return null
        }
      },
    }),
    
  ],
  pages:{
    signIn:"/sign-in",
    error:"/error",
  }
})