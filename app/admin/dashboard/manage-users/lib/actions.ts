import prisma from "@/lib/prisma";
import { TColumn } from "./columns";
import { SchemaUser } from "@/lib/schema";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const saltRounds = 10;

export async function getUsers(){
    try {
        const users = await prisma.user.findMany({})

        const response: TColumn[] = users.map((user) => {
            return {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role:user.role,
                last_login:user.last_login
            }
        })

        console.table(response)
        return response
    } catch (error) {
        console.log(error);
        return []
    }
}

export async function CreateUser(_:unknown,formData:FormData){
    const validate = SchemaUser.safeParse({
        username:formData.get("username"),
        email:formData.get("email"),
        password:formData.get("password"),
        role:formData.get("role")
    })

    if(!validate.success){
    return {error: validate.error.message}
  }

  const passwordHash = bcrypt.hashSync(validate.data.username,saltRounds)

  try{
    await prisma.user.create({
      data:{
        username:validate.data.username,
        email:validate.data.email,
        password_hash:passwordHash,
        role:validate.data.role
      }
    })
  }catch(err){
    console.log(err);
        return {
            error: 'Failed Create New User'
        }
  }

  return redirect("/admin/dashboard/manage-users")
}

export async function UpdateUser(
  _:unknown,
  formData:FormData,
  id:number | undefined
){
      const validate = SchemaUser.safeParse({
        username:formData.get("username"),
        email:formData.get("email"),
        password:formData.get("password"),
        role:formData.get("role")
    })

    if(!validate.success){
    return {error: validate.error.message}
  }

  if (id === undefined) {
		return {
			error: "Id is not found",
		};
	}

  const passwordHash = bcrypt.hashSync(validate.data.username,saltRounds)

  try{
    await prisma.user.update({
      where:{
        user_id:id
      },
      data:{
        username:validate.data.username,
        email:validate.data.email,
        password_hash:passwordHash,
        role:validate.data.role
      }
    })
  }catch(err){
    console.log(err);
        return {
            error: 'Failed update User'
        }
  }

  return redirect("/admin/dashboard/manage-users")

}

export async function GetUserById(id:string){
  try {
		const user = await prisma.user.findFirst({
			where: {
				user_id: Number.parseInt(id),
			},
		});

		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function DeleteUserById(id:string){
  try {
		const user = await prisma.user.delete({
			where: {
				user_id: Number.parseInt(id),
			},
		});

		return {success:"User Has Been Deleted"};
	} catch (error) {
		console.log(error);
		return null;
	}
}