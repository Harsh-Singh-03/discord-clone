"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { isValidName } from "@/lib/utils"
import { MemberRole, Server } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export const createServer = async (name: string, imageUrl: string) => {
    if (!isValidName(name) || !imageUrl) {
        return { success: false, message: 'Invalid field!' }
    }
    const res = await fetchUser()
    if (!res || !res.success || !res.user) {
        return { success: false, message: 'Session expired relogin!' }
    }
    try {
        const response = await db.server.create({
            data: {
                name,
                imageUrl,
                inviteCode: uuidv4(),
                userId: res.user.id,
                members: {
                    create: [{ userId: res.user.id, role: MemberRole.ADMIN }]
                },
                channels: {
                    create: [{ name: 'general', userId: res.user.id }]
                }
            }
        })
        if (!response) return { success: false, message: 'Something went wrong!' }
        return { success: true, message: `${response.name} created successfully!`, serverId: response.id }
    } catch {
        return { success: false, message: 'Something went wrong!' }
    }
}

export const getServerdata = async (serverId: string) => {
    try {
        const data = await db.server.findUnique({
            where: {
                id: serverId,
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                email: true,
                                username: true,
                                bio: true,
                                provider: true,
                                isEmailVerified: true,
                            }
                        }
                    },
                    orderBy: {
                        role: 'asc'
                    }
                },
                channels: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                _count: true
            }
        })
        if (!data) return { success: false }
        return { success: true, server: data }
    } catch {
        return { success: false }
    }
}

export const generateNewInviteCode = async (serverId: string) => {
    try {
        const res = await fetchUser()
        if (!res || !res.success || !res.user) return { success: false, message: 'Session expired!' }

        await db.server.update({
            where: { id: serverId, userId: res.user.id },
            data: { inviteCode: uuidv4() }
        })

        revalidatePath(`/servers/${serverId}`)
        return { success: true, message: 'New url generated!!' }
    } catch {
        return { success: false, message: 'Something went wrong' }
    }

}

export const LeaveServer = async (serverId: string, serverName: string) => {
    try {
        const res = await fetchUser()
        if (!res || !res.user || !res.success) return ({ success: false, message: 'session expired' })

        const result = await db.member.findFirst({
            where: {
                serverId: serverId,
                userId: res.user.id
            }
        })
        if (!result || result.role === 'ADMIN') {
            return {
                success: false,
                message: 'Invalid request!'
            }
        }
        await db.member.delete({
            where: { id: result.id, serverId: result.serverId }
        })
        revalidatePath('/')
        return {
            success: true,
            message: `${res.user.name} left the ${serverName}`
        }
    } catch {
        return {
            success: false,
            message: 'Something went wrong!'
        }
    }
}

export const deleteServer = async (serverId: string) => {
    try {

        const res = await fetchUser()
        if (!res || !res.user || !res.success) return ({ success: false, message: 'session expired' })

        await db.server.delete({
            where: { id: serverId, userId: res.user.id }
        })

        return { success: true, message: 'Server deleted successfully!' }
    } catch {
        return {
            success: false,
            message: 'Something went wrong!'
        }
    }
}

interface updateProps {
    serverId: string,
    values: Partial<Server>,
    path: string
}

export const updateServerInfo = async ({ serverId, values, path }: updateProps) => {
    try {
        const res = await fetchUser()
        if (!res || !res.user || !res.success) return ({ success: false, message: 'session expired' })

        const validData = {
            imageUrl: values.imageUrl,
            name: values.name,
            bio: values.bio
        };
        await db.server.update({
            where: { id: serverId, userId: res.user.id },
            data: { ...validData }
        })
        revalidatePath(path)
        return { success: true, message: 'Server updated!' }
    } catch {
        return {
            success: false,
            message: 'Something went wrong!'
        }
    }
}
