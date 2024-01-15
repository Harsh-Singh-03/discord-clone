"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface channelProps{
    serverId: string,
    role?: MemberRole,
    name: string,
    type: ChannelType,
    path: string
}
export const createChannelInServer = async ({serverId, name, type, path}: channelProps) => {
    try {
        const res = await fetchUser()
        if(!res || !res.success || !res.user) return {success: false, message: 'Session expired!'}
        const response = await db.server.findUnique({
            where: {id: serverId},
            select:{
                members: true
            }
        })
        if(!response) return {success: false, message: "Invalid request"}
        const role = response.members.find((member) => member.userId === res.user.id)?.role;
        if(!role || role === 'GUEST') return {success: false, message: 'Unauthorized!'}
        await db.channel.create({
            data: {
                name,
                serverId: serverId,
                type: type,
                userId: res.user.id
            }
        })
        revalidatePath(path)
        return {success: true, message: 'Channel created successfully!!'}
    } catch {
        return {success: false, message: 'Something went wrong'}
    }
}