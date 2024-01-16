import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/lib/type";
import { ChannelAccess, ChannelType, MemberRole, MessageType } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {

    if (req.method !== 'POST') {
        return res.status(403).send({ success: false, message: 'Invalid request!' })
    }

    try {
        const { userId, channelId, serverId } = req.query
        const { content, messageType } = req.body;
        if (!content || !serverId || !channelId || !messageType || !userId) return res.status(400).send({ success: false, message: 'Invalid request data' })

        const userData = await db.user.findUnique({ where: { id: userId as string } })
        if (!userData || !userData.id) {
            return res.status(400).send({ message: 'Session expired!', success: false })
        }

        const channelData = await db.channel.findUnique({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        const memberData = await db.member.findFirst({
            where: {
                userId: userData.id,
            }
        })

        if (!memberData || !channelData) return res.status(400).send({ message: 'Bad request', success: false })

        if (channelData.isPrivate === true && memberData.role === MemberRole.GUEST) {
            return res.status(401).send({ message: 'Unauthorized', success: false })
        }

        if (channelData.whoCanMessage === ChannelAccess.ADMIN_ONLY && memberData.role !== MemberRole.ADMIN) {
            return res.status(401).send({ message: 'Unauthorized', success: false })
        }
        if (channelData.whoCanMessage === ChannelAccess.MODS && memberData.role === MemberRole.GUEST) {
            return res.status(401).send({ message: 'Unauthorized', success: false })
        }

        const message = await db.message.create({
            data: {
                content: content,
                channelId: channelData.id as string,
                memberId: memberData.id,
                messageType: messageType === 'FILE' ? MessageType.FILE : MessageType.TEXT
            },
            include: {
                member: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                username: true,
                            }
                        }
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`
        res.socket.server.io.emit(channelKey, message)
        return res.status(200).json({ success: true, result: message, message: 'Message send successfully' })

    } catch {
        return res.status(500).send({ success: false, message: 'Something went wrong' })
    }
}