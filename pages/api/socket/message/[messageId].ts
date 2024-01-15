import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/lib/type";
import { MemberRole, MessageType } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req:NextApiRequest, res: NextApiResponseServerIO) {

    if(req.method !== 'PATCH' && req.method !== "DELETE"){
        return res.status(403).send({success: false, message: 'Invalid request!'})
    }

    try {
        const {userId, channelId, serverId, messageId } = req.query
        const { content, messageType } = req.body;

        if(!serverId || !channelId || !messageId || !userId) {
            return res.status(400).send({success: false, message: 'Invalid request data'})
        }

        const userData = await db.user.findUnique({where: { id: userId as string}})
        if(!userData || !userData.id){
           return res.status(400).send({message: 'Session expired!', success: false})
        }

        const memberData = await db.member.findFirst({
            where:{
                userId: userData.id,
                serverId: serverId as string
            }
        })
 
        if(!memberData) return res.status(400).send({message: 'Bad request', success: false})
        
        let messageData = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string
            }
        })

        if (!messageData || messageData.isDeleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isOwner = messageData.memberId === memberData.id
        const isAdmin = memberData.role === MemberRole.ADMIN
        const isModerator = memberData.role === MemberRole.MODERATOR
        const canModify = isOwner || isAdmin || isModerator

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
          }

        if(req.method === 'PATCH'){
            if(!isOwner || !messageType || !content || messageType !== MessageType.TEXT){
                return res.status(401).json({ error: "Unauthorized" });
            }

            messageData = await db.message.update({
                where: {messageType: MessageType.TEXT, id: messageId as string},
                data: {
                    content
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
            
        }
        if(req.method === "DELETE"){
            messageData = await db.message.update({
                where: { id: messageId as string, channelId: channelId as string },
                data: {
                    messageType: MessageType.TEXT,
                    content: 'This message has been deleted',
                    isDeleted: true
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
        }

        const updateKey = `chat:${channelId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, messageData);

        return res.status(200).json({success: true, result: messageData, message: 'Message send successfully'})

    } catch {
        return res.status(500).send({success: false, message: 'Internal server error!'})
    }
}   