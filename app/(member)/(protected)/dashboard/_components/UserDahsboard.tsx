"use client"

import { Member as MemberType } from "@/lib/generated/prisma"

export default function UserDashboard({ member }: {member:MemberType}) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Halo, {member.user_id}!</h1>
      <p className="text-gray-600">Email: {member.nis}</p>
    </div>
  )
}
