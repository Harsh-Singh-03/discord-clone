"use client"

import { Member, MemberRole, MessageType } from "@prisma/client"
import { Edit, ShieldAlert, ShieldCheck, Trash, X } from "lucide-react"
import { FormEvent, useState } from "react"
import { UserAvatar } from "../globals/user-avatar"
import { TooltipComponent } from "../globals/tooltip"
import Image from "next/image"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import qs from 'query-string'
import axios from "axios"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { DeleteMessageModal } from "../dialogs/delete-message-modal"

interface props {
    id: string,
    content: string,
    messageType: MessageType,
    timestamp: string,
    isUpdated: boolean,
    socketUrl: string,
    isDeleted: boolean,
    socketQuery: Record<string, string>,
    member: Member & {
        user: {
            id: string,
            image: null | string,
            name: string,
            username: string,
        },
    },
    currentMember: Member,
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4  text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4  text-rose-500" />,
}

export const ChatItem = ({ content, currentMember, isDeleted, id, isUpdated, member, messageType, socketQuery, socketUrl, timestamp }: props) => {
    const [isPending, setIsPending] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(content)

    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id === member.id
    const canDeleteMessage = !isDeleted && (isAdmin || isModerator || isOwner)
    const canEditMessage = !isDeleted && isOwner && messageType !== MessageType.FILE

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (content === editContent || !canEditMessage) {
            setIsEditing(false)
            return
        }
        setIsPending(true)
        const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
        });
        const body = { content: editContent, messageType }
        try {
            const data = await axios.patch(url, body)
            if (data.data.success && data.status === 200) {
                toast.success("Message edited")
            } else {
                toast.error(data.data.message)
            }
        } catch {
            toast.error('Somethign went wrong');
        } finally {
            setEditContent(content)
            setIsPending(false)
            setIsEditing(false)
        }
    }

    return (
        <div className="relative group flex gap-x-3 hover:bg-black/5 p-4 transition w-full">
            <div className="cursor-pointer hover:drop-shadow-md transition">
                <UserAvatar placeholder={member.user.name} imageUrl={member.user.image || ''} />
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-x-2">
                    <p className="font-semibold text-sm hover:underline cursor-pointer">
                        {member.user.name}
                    </p>
                    <TooltipComponent label={member.role} position="top">
                        {roleIconMap[member.role]}
                    </TooltipComponent>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {timestamp}
                    </span>
                </div>
                <div className="">

                    {messageType === MessageType.FILE && (
                        <a
                            href={content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                src={content}
                                alt={'Url'}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}

                    {messageType === MessageType.TEXT && !isEditing && (
                        <p className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300",
                                isDeleted && "text-[13px] mt-0.5 text-zinc-500 dark:text-zinc-400 italic"
                            )}
                        >
                            {content}
                            {isUpdated && !isDeleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}

                    {isEditing && messageType === MessageType.TEXT && !isDeleted && (
                        <form className="flex gap-x-3 items-center mt-2" onSubmit={onSubmit}>
                            <Input
                                className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                placeholder="Edit message"
                                required
                                disabled={isPending}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <Button variant='primary' size='sm' type="submit" disabled={isPending}>Save</Button>
                            <button
                                className="aspect-square grid place-items-center bg-[#F2F3F5] dark:bg-zinc-700/75 p-1 lg:p-2 rounded-full"
                                onClick={() => { setIsEditing(false); setEditContent(content) }}
                            >
                                <X className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition stroke-[2px] w-4 h-4" />
                            </button>
                        </form>
                    )}

                </div>
            </div>
            {canDeleteMessage && !isEditing && (
                <div className="hidden group-hover:flex items-center gap-x-4 absolute py-2 px-4 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <TooltipComponent label="Edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </TooltipComponent>
                    )}
                    <TooltipComponent label="Delete" position="top" variant="danger">
                        <DeleteMessageModal apiUrl={`${socketUrl}/${id}`} socketQuery={socketQuery}>
                            <Trash
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </DeleteMessageModal>
                    </TooltipComponent>
                </div>
            )}
        </div>
    )
}