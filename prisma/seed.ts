import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PrismaClient, Prisma } from "../lib/generated/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();



const userData: Prisma.UserCreateInput[] = [
  {
    username: "Aditya",
    email: "Aditya@gmail.com",
    password_hash:"$2a$10$cKpVeVrdMtUL/gwSv3ErQumTbXG/9Vf3gaJbTk3Cw5scSzkHO2J/O",
    role:"member",
    created_at:dayjs().toDate(),
    last_login:dayjs().toDate(),
    is_active:true
  },
  {
    username: "Helmi",
    email: "Helmi@gmail.com",
    password_hash:"$2a$10$cKpVeVrdMtUL/gwSv3ErQumTbXG/9Vf3gaJbTk3Cw5scSzkHO2J/O",
    role:"super_admin",
    created_at:dayjs().toDate(),
    last_login:dayjs().toDate(),
    is_active:true
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();