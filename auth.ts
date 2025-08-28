import NextAuth,{ type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb } from "./lib/utils"
import { schemaSignIn } from "./lib/schema"
import { ZodError } from "zod"


declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
  interface User {
    role: string;
  }
}
 
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
          return {
            id:String(user.user_id),
            name:user.username,
            email:user.email,
            image:null,
            role:user.role

          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          return null
        }
      },
    }),
    
  ],
  callbacks: {
    async jwt({ token, user }) {
    // Saat login pertama kali, 'user' akan ada
    if (user) {
      token.id = user.id
      token.role = (user as any).role; // masukkan role ke token
    }
    return token;
  },
  async session({ session, token }) {
    // Ambil role dari token dan masukkan ke session
    if (session.user) {
      session.user.role = token.role as string;
      session.user.id = token.id as string
    }
    return session;
  },
 
  },
  pages:{
    signIn:"/sign-in",
    error:"/error",
  }
})