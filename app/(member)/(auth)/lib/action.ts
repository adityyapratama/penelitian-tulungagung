'use server'

import { signIn } from "@/auth"
import { ActionResult } from "@/types"
import { SchemaRegister } from "@/lib/schema"
import { AuthError } from "next-auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

const saltRounds = 10;

export async function handleLogin(_: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try{
   await signIn("credentials", {
    email,
    password,
    redirectTo:"/" ,
  })
  }catch(error){
    if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: 'Invalid credentials',
                    }
                default:
                    return {
                        message: 'Something went wrong.',
                    }
            }
        }
        throw error;
  }
}

export async function handleRegister(_:unknown,formData:FormData):Promise <ActionResult>{
  const parse = SchemaRegister.safeParse({
    username:formData.get("username"),
    email:formData.get("email"),
    password:formData.get("password")})

  if(!parse.success){
    return {error: parse.error.message}
  }

  const passwordHash = bcrypt.hashSync(parse.data.username,saltRounds)

  try{
    await prisma.user.create({
      data:{
        username:parse.data.username,
        email:parse.data.email,
        password_hash:passwordHash,
        role:"member"
      }
    })
  }catch(err){
    console.log(err);
        return {
            error: 'Failed to sign up'
        }
  }

  return redirect("/signin")
}
