"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { handleLogin } from "@/app/admin/(auth)/sign-in/lib/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";

export function AdminSignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction] = useActionState(handleLogin, null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={formAction}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Image
                  src={"/asset/unair.png"}
                  alt={"Logo Unair"}
                  width={64}
                  height={64}
                  className="mx-auto"
                />
              </div>
              <span className="sr-only">Admin Pusaka Tulungagung</span>
            </Link>
            <h1 className="text-xl font-bold">Admin Pusaka Tulungagung</h1>
            <p className="text-sm">
              Masukkan kredensial anda untuk melanjutkan
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="email@gmail.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="******"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          {state?.message && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{state.message}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
