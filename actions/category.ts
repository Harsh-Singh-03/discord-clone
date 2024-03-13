"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { isValidName } from "@/lib/utils"
import { MemberRole } from "@prisma/client"
import { revalidatePath } from "next/cache"


export const createCategoryInServer = async (title: string, serverId: string, path: string) => {
    if (!isValidName(title)) {
        return { success: false, message: 'Invalid field!' }
    }
    
    try {
        const res = await fetchUser()
        if (!res || !res.success || !res.user) {
            return { success: false, message: 'Session expired relogin!' }
        }

        const memberData = await db.member.findFirst({
            where: {
                serverId: serverId,
                userId: res.user.id
            }
        })
        if(!memberData) return {success: false, message: 'not found'}
        if(memberData.role !== MemberRole.ADMIN) return {success: false, message: 'unauthorized'}

        const response = await db.category.create({
            data: {
                title,
                serverId: memberData.serverId || serverId,
                userId: res.user.id,
            }
        })
        if (!response) return { success: false, message: 'Something went wrong!' }
        revalidatePath(path)
        return { success: true, message: `${response.title} created successfully!` }
    } catch {
        return { success: false, message: 'Something went wrong!' }
    }
}