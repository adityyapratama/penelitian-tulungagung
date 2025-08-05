import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword,comparePassword } from "./lib/utils"
import { PrismaClient,User } from "./lib/generated/prisma";

const prisma = new PrismaClient()

async function getUserFromDb(email :string, password:string):Promise<Omit<User, 'password_hash'> | null> {

  try {
    // 1. Cari user di database berdasarkan email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Jika user tidak ditemukan, langsung kembalikan null
    if (!user) {
      return null;
    }

    // 2. Jika user ditemukan, bandingkan password
    // Catatan: Anda harus menggunakan plaintext password di sini, bukan hash password yang Anda buat
    // karena fungsi comparePassword akan mengambil salt dari hash yang tersimpan di database.
    const passwordsMatch = await comparePassword(password, user.password_hash);

    // Jika password tidak cocok, kembalikan null
    if (!passwordsMatch) {
      return null;
    }

    // Jika semua verifikasi berhasil, kembalikan objek user
    // Anda bisa mengembalikan objek user tanpa password untuk keamanan
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;

  } catch (error) {
    console.error("Error during user authentication:", error);
    return null;
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
 
        // logic to salt and hash password
        const pwHash = saltAndHashPassword(String(credentials.password))
 
        // logic to verify if the user exists
        user = await getUserFromDb(String(credentials.email), String(pwHash))
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
})