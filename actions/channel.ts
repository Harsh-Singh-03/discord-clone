"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { Channel, ChannelAccess, ChannelType, MemberRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface channelProps {
    serverId: string,
    categoryId: string,
    role?: MemberRole,
    name: string,
    type: ChannelType,
    path: string,
    whoCanAccess: ChannelAccess
    isPrivate: boolean
}

export const createChannelInServer = async ({ categoryId, serverId, name, type, path, whoCanAccess, isPrivate }: channelProps) => {
    try {
        const res = await fetchUser()
        if (!res || !res.success || !res.user) return { success: false, message: 'Session expired!' }

        const response = await db.member.findFirst({
            where: {
                userId: res.user.id,
                serverId: serverId
            }
        })
        // console.log(response)
        if (!response) return { success: false, message: "Invalid request" }
        if (!response.role || response.role === MemberRole.GUEST) return { success: false, message: 'Unauthorized!' }

        const category = await db.category.findUnique({
            where: {
                id: categoryId,
                serverId: serverId
            }
        })

        if (!category) return { success: false, message: 'category not found' }

        const lastChannel = await db.channel.findFirst({
            where: {
                Category: {
                    id: categoryId,
                    serverId: serverId
                }
            },
            orderBy: {
                order: 'desc'
            },
            select: {
                order: true
            }
        })

        const newOrder = !!lastChannel ? lastChannel.order + 1 : 1

        await db.channel.create({
            data: {
                name,
                categoryId: category.id,
                type: type,
                order: newOrder,
                userId: res.user.id,
                isPrivate: isPrivate || false,
                whoCanMessage: whoCanAccess || ChannelAccess.EVERYONE
            }
        })
        revalidatePath(path)
        return { success: true, message: 'Channel created successfully!!' }

    } catch {
        return { success: false, message: 'Something went wrong' }
    }
}

export const deleteChannel = async (channelId: string, serverId: string) => {
    try {
        const res = await fetchUser()
        if (!res || !res.success || !res.user) return { success: false, message: 'Unauthorized' }

        if (!serverId || !channelId) return { success: false, message: 'Invalid request' }

        const verifyRequest = await db.channel.findFirst({
            where: {
                id: channelId, Category: {
                    server: {
                        id: serverId,
                        userId: res.user.id
                    }
                }
            }
        })

        if (!verifyRequest) return { success: false, message: 'unauthorized' }

        await db.channel.delete({
            where: { id: channelId },
        })

        revalidatePath(`/servers/${serverId}/settings`)
        return { success: true, message: 'Channel deleted successfully' }
    } catch (error) {
        console.log(error)
        return { success: false, message: "something went wrong" }
    }
}


interface updateProps {
    serverId: string,
    values: Partial<Channel>,
}

export const updateChannelInfo = async ({ serverId, values }: updateProps) => {
    try {
        const res = await fetchUser()
        if (!res || !res.user || !res.success) return ({ success: false, message: 'session expired' })

        if (!values || !serverId || !values.id) return ({ success: false, message: 'Invalid request' })

        const verifyRequest = await db.channel.findFirst({
            where: {
                id: values.id,
                Category: {
                    server: {
                        id: serverId,
                        userId: res.user.id
                    }
                }
            }
        })

        if (!verifyRequest) return { success: false, message: 'unauthorized' }

        const validData = {
            name: values.name,
            type: values.type,
            isPrivate: values.isPrivate,
            whoCanMessage: values.whoCanMessage,
            categoryId: values.categoryId
        };

        await db.channel.update({
            where: { id: values.id },
            data: { ...validData }
        })
        revalidatePath(`/servers/${serverId}/settings`)
        return { success: true, message: 'Channel updated!' }
    } catch {
        return {
            success: false,
            message: 'Something went wrong!'
        }
    }
}

export const updateChannelOrder = async (channels: Channel[]) => {
    try {

        const transaction = channels.map((cnl) =>
            db.channel.update({
                where: {
                    id: cnl.id,
                    // categoryId: id
                },
                data: {
                    order: cnl.order,
                    categoryId: cnl.categoryId
                },
            })
        );

        await db.$transaction(transaction)
        return { success: true, message: "channels updated" }
    } catch (error) {
        console.log(error)
        return { success: false, message: "internal server error" }
    }
}