"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CreateUser } from "@/app/admin/dashboard/manage-users/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CircleAlert, User, Mail, Lock, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? "Menyimpan..." : "Simpan User"}
    </Button>
  );
}

type FormState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string;
};

export default function CreateUserPage() {
  const initialState: FormState = {};
  const [state, formAction] = useActionState(CreateUser, initialState);

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full border-0 max-w-5xl">
            <form action={formAction}>
              <CardHeader className=" pb-6">
                <CardTitle className="text-2xl font-bold">
                  Tambah User Baru
                </CardTitle>
                <CardDescription className="text-base">
                  Lengkapi informasi di bawah ini untuk membuat akun user baru
                  dalam sistem
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {state.message && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                    <CircleAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Terjadi Kesalahan</p>
                      <p className="text-sm mt-1">{state.message}</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  {/* Username Input */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Masukkan username (contoh: johndoe)"
                      className="h-11"
                    />
                    {state.errors?.username && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-2">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.username[0]}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Masukkan alamat email (contoh: john@example.com)"
                      className="h-11"
                    />
                    {state.errors?.email && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-2">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.email[0]}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Masukkan password yang aman"
                      className="h-11"
                    />
                    {state.errors?.password && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-2">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.password[0]}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Password minimal 8 karakter dengan kombinasi huruf dan
                      angka
                    </p>
                  </div>

                  {/* Role Select */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="role"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Role
                    </Label>
                    <Select name="role">
                      <SelectTrigger id="role" className="h-11">
                        <SelectValue placeholder="Pilih role untuk user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Super Admin</div>
                              <div className="text-xs text-muted-foreground">
                                Akses penuh ke semua fitur
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="guru">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Guru</div>
                              <div className="text-xs text-muted-foreground">
                                Akses untuk mengelola pembelajaran
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="member">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Member</div>
                              <div className="text-xs text-muted-foreground">
                                Akses dasar sebagai pengguna
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {state.errors?.role && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-2">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.role[0]}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-6 bg-slate-50/50 dark:bg-slate-800/50">
                <Button
                  variant="outline"
                  asChild
                  className="min-w-[120px] bg-transparent"
                >
                  <Link href="/admin/dashboard/manage-users">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Batal
                  </Link>
                </Button>
                <SubmitButton />
              </CardFooter>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
