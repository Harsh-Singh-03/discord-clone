"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { isValidName } from "@/lib/utils"
import { MemberRole, Server } from "@prisma/client";
// import { getServerSession } from "next-auth";
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
                Category: {
                    create: [{
                        title: 'Uncategorized',
                        userId: res.user.id,
                        channels: {
                            create: [{
                                name: 'general',
                                userId: res.user.id
                            }]
                        }
                    }]
                }
            }
        })
        if (!response) return { success: false, message: 'Something went wrong!' }
        revalidatePath('/')
        return { success: true, message: `${response.name} created successfully!`, serverId: response.id }
    } catch {
        return { success: false, message: 'Something went wrong!' }
    }
}

export const getServerdata = async (serverId: string, userId: string) => {
    try {
        const data = await db.server.findUnique({
            where: {
                id: serverId,
            },
            include: {
                members: {
                    where: { userId },
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
                        },
                    },
                    orderBy: {
                        role: 'asc'
                    }
                },
                Category: {
                    include: {
                        channels: {
                            orderBy: {
                                createdAt: 'desc'
                            }
                        },
                        _count: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: true
            }
        })
        // console.log(data)
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
        if (!result || result.role === MemberRole.ADMIN) {
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

interface member_type {
    serverId: string,
    userId: string,
    search?: string,
    page?: number
}

export const getServerMember = async ({ serverId, userId, search = '', page = 1 }: member_type) => {
    try {
        const pageSize = 25; // Number of items per page
        const currentPage = page; // Current page, you can change this dynamically
        const offset = (currentPage - 1) * pageSize; // Calculate offset for pagination

        const members = await db.member.findMany({
            where: {
                serverId,
                userId: { not: userId },
                OR: [
                    { user: { name: { contains: search } } },
                    { user: { email: { contains: search } } },
                    { user: { username: { contains: search } } },
                ]
            },
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
                },
            },
            take: pageSize, // Limit the number of results per page
            skip: offset, // Skip the first 'offset' number of results
        })

        return { success: true, members, message: "successfully get data" }
    } catch {
        return { success: false, message: "Something went wrong!" }
    }
}
// for kicking member
export const removeMember = async ({serverId, memberId} : {serverId: string, memberId: string}) => {
    try {
        const res = await fetchUser()
        if(!res || !res.success || !res.user) return {success: false, message: "unauthorized"}
        const serverData = await db.server.findFirst({where: {id: serverId}})
        if(!serverData || serverData?.userId !== res.user.id) return {success: false, message: "unauthorized"}

        const data = await db.member.delete({
            where: {id: memberId, serverId, role: {not: MemberRole.ADMIN}}
        })

        if(!data) return {success: false, message: "something went wrong"}

        return {success: true, message: `member successfully kicked from ${serverData.name}`}

    } catch (error) {
        console.log(error)
        return {success: false, message: "Internal server error"}
    }
}
// for updating role
export const updateRole = async ({serverId, memberId, role} : {serverId: string, memberId: string, role: MemberRole}) => {
    try {
        const res = await fetchUser()
        if(!res || !res.success || !res.user) return {success: false, message: "unauthorized"}

        const serverData = await db.server.findFirst({where: {id: serverId}})
        if(!serverData || serverData?.userId !== res.user.id) return {success: false, message: "unauthorized"}

        const data = await db.member.update({
            where: {id: memberId, serverId, role: {not: MemberRole.ADMIN}},
            data: {role}
        })

        if(!data) return {success: false, message: "something went wrong"}

        return {success: true, message: `member's role successfully updated`}

    } catch (error) {
        console.log(error)
        return {success: false, message: "Internal server error"}
    }
}