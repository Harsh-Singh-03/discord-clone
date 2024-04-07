"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { isValidName } from "@/lib/utils"
import { Category, MemberRole } from "@prisma/client"
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
        if (!memberData) return { success: false, message: 'not found' }
        if (memberData.role !== MemberRole.ADMIN) return { success: false, message: 'unauthorized' }

        const lastCat = await db.category.findFirst({
            where: {serverId },
            orderBy: {
               order: 'desc'
            },
            select: {
                order: true
            }
        })

        const newOrder = !!lastCat ? lastCat.order + 1 : 1
        
        const response = await db.category.create({
            data: {
                title,
                serverId: memberData.serverId || serverId,
                userId: res.user.id,
                order: newOrder
            }
        })
        if (!response) return { success: false, message: 'Something went wrong!' }
        revalidatePath(path)
        return { success: true, message: `${response.title} created successfully!` }
    } catch {
        return { success: false, message: 'Something went wrong!' }
    }
}

export const updateCategory = async (severId: string, category: string, title: string) => {
    try {
        const res = await fetchUser()
        if (!res || !res.success || !res.user) return { success: false, message: 'Unauthorized' }

        if (!title || !severId || !category) return { success: false, message: "Invalid data" }

        const serverData = await db.server.findFirst({ where: { id: severId } })
        if (!serverData || serverData.userId !== res.user.id) return { success: false, message: "Unauthorized" }

        const categoryData = await db.category.findFirst({ where: { id: category } })
        if (!categoryData) return { success: false, message: "Category not found" }

        const data = await db.category.update({
            where: { id: category },
            data: { title }
        })

        revalidatePath(`/servers/${serverData.id}/settings`)
        return { success: true, message: 'Category updated successfully', data }

    } catch (error) {
        console.log(error);
        return { success: false, message: "something went wrong" }
    }
}

export const deleteCategory = async (catId: string, serverId: string) => {
    try {
        const res = await fetchUser()
        if (!res || !res.success || !res.user) return { success: false, message: 'Unauthorized' }

        if(!serverId || !catId) return { success: false, message: 'Invalid request' }

        const verifyRequest = await db.category.findFirst({
            where: {id: catId, server: {
                id: serverId,
                userId: res.user.id
            }}
        })

        if(!verifyRequest) return { success: false, message: 'unauthorized' }

        const data = await db.category.delete({
            where: { id: catId, serverId: serverId },
        })

        if(!data) return { success: false, message: 'something went wrong'}

        revalidatePath(`/servers/${verifyRequest.serverId}/settings`)
        return { success: true, message: 'Category deleted successfully', data }
    } catch (error) {
        console.log(error)
        return { success: false, message: "something went wrong" }
    }
}

export const updateCategoryOrder = async ( items: Category[]) => {
    try {
        const transaction = items.map((cat) =>
            db.category.update({
                where: {
                    id: cat.id,
                },
                data: {
                    order: cat.order,
                },
            })
        );

        await db.$transaction(transaction)
        return {success: true, message: "category updated"}
    } catch (error) {
        console.log(error)
        return {success: false, message: "internal server error"}
    }
}