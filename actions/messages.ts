"use server"

import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { MessageWithMemberWithProfile } from "@/lib/type"
// import { Message } from "@prisma/client"


export const getChannelMessages = async ( channelId: string, cursor: any ) => {
    try {
        const MESSAGES_BATCH = 10
        const res = await fetchUser()
        if (!res || !res.user || !res.success) return { success: false, message: 'Session expired!' }

        let messages: MessageWithMemberWithProfile[] = []

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    image: true
                                }
                            },
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    image: true
                                }
                            },
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            });
        }

        let nextCursor = null
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH - 1].id
        }

        return {
            success: true,
            nextCursor,
            items: messages,
            messages: 'Successfull'
        }

    } catch {
        return { success: false, message: 'Something went wrong!' }
    }
}