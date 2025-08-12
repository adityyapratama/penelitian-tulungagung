"use client"; // This is a Client Component

import { useActionState } from "react";
import { handleLogin } from "@/app/(member)/(auth)/lib/action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function SignInForm() {
  const [state, formAction] = useActionState(handleLogin, null);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
      {/* Judul Form */}
      <div className="text-center">
        <Image
          src={"/asset/unair.png"}
          alt={"Logo Unair"}
          width={64}
          height={64}
          className="mx-auto"
        />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Pusaka Tulungagung
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Silakan masuk untuk melanjutkan
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-6">
        {/* Input Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            required
            placeholder="anda@email.com"
          />
        </div>

        {/* Input Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-3/4">
              Lupa password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            name="password"
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            required
            placeholder="••••••••"
          />
        </div>

        {/* Pesan Error */}
        {state?.message && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{state.message}</p>
          </div>
        )}

        {/* Tombol Submit */}
        <div>
          <Button type="submit" className="w-full" size="lg">Masuk</Button>
          <p className="mt-2 text-sm text-center text-gray-600">
            Belum mempunyai akun ?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-3/4">
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}