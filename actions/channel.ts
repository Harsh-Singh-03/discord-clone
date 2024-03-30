"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { ChannelAccess, ChannelType, MemberRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface channelProps{
    serverId: string,
    categoryId: string,
    role?: MemberRole,
    name: string,
    type: ChannelType,
    path: string,
    whoCanAccess: ChannelAccess
    isPrivate: boolean
}

export const createChannelInServer = async ({categoryId, serverId, name, type, path, whoCanAccess, isPrivate}: channelProps) => {
    try {
        const res = await fetchUser()
        if(!res || !res.success || !res.user) return {success: false, message: 'Session expired!'}

        const response = await db.member.findFirst({
            where: {
                userId: res.user.id,
                serverId: serverId
            }
        })
        console.log(response)
        if(!response) return {success: false, message: "Invalid request"}
        if(!response.role || response.role === MemberRole.GUEST) return {success: false, message: 'Unauthorized!'}

        const category = await db.category.findUnique({
            where: {
                id: categoryId,
                serverId: serverId 
            }
        })

        if(!category) return {success: false, message: 'Not found'}
        
        await db.channel.create({
            data: {
                name,
                categoryId: category.id,
                type: type,
                userId: res.user.id,
                isPrivate: isPrivate || false,
                whoCanMessage: whoCanAccess || ChannelAccess.EVERYONE
            }
        })
        revalidatePath(path)
        return {success: true, message: 'Channel created successfully!!'}
        
    } catch {
        return {success: false, message: 'Something went wrong'}
    }
}