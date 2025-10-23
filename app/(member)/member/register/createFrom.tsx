"use client";

import type React from "react";
import { useActionState, useEffect, useState } from "react";
import { CreateMember } from "@/app/(member)/lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CircleAlert,
  ArrowLeft,
  UploadCloud,
  X,
  CalendarDays,
  School,
  User,
  Info,
  Heart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

type Sekolah = {
  sekolah_id: number;
  nama_sekolah: string | null;
  alamat_sekolah: string | null;
};

type CreateMemberPageProps = { sekolah: Sekolah[] | { error: unknown } };

export default function CreateMemberPage({ sekolah }: CreateMemberPageProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(CreateMember, { error: "" });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMinat, setSelectedMinat] = useState<string[]>([]);

  // Type guard untuk check apakah sekolah adalah array
  const sekolahList = Array.isArray(sekolah) ? sekolah : [];

  useEffect(() => {
    if (state?.success) {
      toast.success("Member berhasil dibuat!");
      setImagePreview(null);
      setTimeout(() => {
        router.push("/sign-in");
      }, 500);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Predefined minat options
  const minatOptions = [
    "Olahraga",
    "Musik",
    "Seni",
    "Teknologi",
    "Literatur",
    "Game",
    "Fotografi",
    "Traveling",
  ];

  // Handle minat button click
  const handleMinatToggle = (minat: string) => {
    setSelectedMinat((prev) =>
      prev.includes(minat)
        ? prev.filter((item) => item !== minat)
        : [...prev, minat]
    );
  };

  // Convert selectedMinat array to comma-separated string for form submission
  const minatValue = selectedMinat.join(", ");

  return (
    <div className="min-h-screen px-4 py-12 overflow-x-hidden bg-gray-50">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-transparent sm:text-4xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">
            Lengkapi Profil Anda
          </h1>
          <p className="text-gray-600">
            Isi data diri untuk mulai bermain quiz
          </p>
        </div>

        <div className="w-full overflow-hidden bg-white shadow-lg rounded-2xl">
          <form action={formAction} className="p-6 sm:p-8">
            {state.error && (
              <div className="flex items-start gap-3 p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                <CircleAlert className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                <div className="text-red-800">
                  <p className="font-medium">Terjadi Kesalahan</p>
                  <p className="mt-1 text-sm">{state.error}</p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Main content wrapper */}
              {/* Sekolah */}
              <div className="space-y-2">
                <Label
                  htmlFor="sekolah_id"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <School className="w-4 h-4 text-blue-600" />
                  Sekolah
                </Label>
                <select
                  id="sekolah"
                  name="sekolah"
                  className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Pilih Sekolah --</option>
                  {sekolahList.map((item) => (
                    <option key={item.sekolah_id} value={item.sekolah_id}>
                      {item.nama_sekolah || "Nama tidak tersedia"}
                    </option>
                  ))}
                </select>
              </div>

              {/* NIS */}
              <div className="space-y-2">
                <Label
                  htmlFor="nis"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  NIS
                </Label>
                <Input
                  id="nis"
                  name="nis"
                  placeholder="Masukkan NIS siswa"
                  className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Foto Profil */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Foto Profil
                </Label>
                <Label
                  htmlFor="foto_profile"
                  className="relative flex items-center justify-center w-full h-48 overflow-hidden transition-all border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50"
                >
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Preview Foto"
                        fill
                        className="object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute z-10 w-8 h-8 bg-red-500 top-2 right-2 hover:bg-red-600"
                        onClick={(e) => {
                          e.preventDefault();
                          const inputFile = document.getElementById(
                            "foto_profile"
                          ) as HTMLInputElement;
                          if (inputFile) inputFile.value = "";
                          setImagePreview(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-blue-600">
                      <UploadCloud className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm font-semibold">
                        Klik untuk memilih foto
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF (maks. 5MB)
                      </p>
                    </div>
                  )}
                </Label>
                <Input
                  id="foto_profile"
                  name="foto_profile"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Info className="w-4 h-4 text-blue-600" />
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tuliskan bio singkat..."
                  rows={3}
                  className="px-4 py-3 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <Label
                  htmlFor="tanggal_lahir"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggal_lahir"
                  name="tanggal_lahir"
                  type="date"
                  className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-2">
                <Label
                  htmlFor="jenis_kelamin"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  Jenis Kelamin
                </Label>
                <Select name="jenis_kelamin">
                  <SelectTrigger
                    id="jenis_kelamin"
                    className="px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Minat */}
              <div className="space-y-2">
                <Label
                  htmlFor="minat"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Heart className="w-4 h-4 text-blue-600" />
                  Minat
                </Label>
                <div className="flex flex-wrap gap-2">
                  {minatOptions.map((minat) => (
                    <Button
                      key={minat}
                      type="button"
                      variant={selectedMinat.includes(minat) ? "default" : "outline"}
                      className={`px-4 py-2 text-sm ${
                        selectedMinat.includes(minat)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handleMinatToggle(minat)}
                    >
                      {minat}
                    </Button>
                  ))}
                </div>
                <input
                  type="hidden"
                  name="minat"
                  value={minatValue}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col gap-3 pt-6 mt-8 border-t border-gray-200 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                asChild
                className="w-full px-6 py-3 border-gray-300 sm:w-auto hover:bg-gray-50"
              >
                <Link href="/games">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Batal
                </Link>
              </Button>
              <Button
                type="submit"
                className="w-full px-8 py-3 text-white transition-all duration-300 shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              >
                Simpan Data
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}