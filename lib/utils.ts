

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import bcrypt from "bcryptjs"
import {User } from "./generated/prisma";
import prisma from "./prisma";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function rupiahFormat(value: number) {
  return Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value)
}

export function dateFormat(date: Date | null, format = 'DD MMMM YYYY') {
  if (!date) {
    return dayjs().format(format)
  }

  return dayjs(date).format(format)
}

export const generateRandomString = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

const saltRounds = 10;

/**
 * Meng-hash password dengan salt menggunakan bcrypt.
 * @param password Plaintext password yang akan di-hash.
 * @returns Promise yang akan menghasilkan hash password.
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  // `bcrypt.hash` secara otomatis membuat salt baru dan menggunakannya.
  // Hasilnya adalah hash yang sudah termasuk salt di dalamnya.
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Membandingkan plaintext password dengan hash password yang sudah tersimpan.
 * @param password Plaintext password dari input pengguna.
 * @param hashedPassword Hash password yang diambil dari database.
 * @returns Promise yang akan menghasilkan true jika cocok, false jika tidak.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const res = bcrypt.compare(password,hashedPassword)
  return res
}

export async function getUserFromDb(
  email: string,
  password: string
): Promise<User | null> {
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

