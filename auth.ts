// lib/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient, User } from "./lib/generated/prisma";
import { schemaSignIn } from "./lib/schema";
import { ZodError } from "zod";
import { comparePassword } from "./lib/utils"; // Import bcrypt di sini

const prisma = new PrismaClient();

async function getUserFromDb(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const passwordsMatch = await comparePassword(password, user.password_hash);
    if (!passwordsMatch) return null;

    return user;
  } catch (error) {
    console.error("Error during user authentication:", error);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        try {
          const validatedCredentials = await schemaSignIn.parseAsync(credentials);
          const user = await getUserFromDb(validatedCredentials.email, validatedCredentials.password);

          if (!user) throw new Error("Invalid credentials.");

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            const errorMessage = error.issues.map(issue => issue.message).join(", ");
            throw new Error(errorMessage);
          }
          throw error;
        }
      },
    }),
  ],
});