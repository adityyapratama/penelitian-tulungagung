import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    // Providers akan didefinisikan di sini
    // (misalnya Credentials)
  ],
  // Tambahkan callbacks, session, pages, dll.
  // ...
} satisfies NextAuthConfig;

export type AuthConfig = typeof authConfig;