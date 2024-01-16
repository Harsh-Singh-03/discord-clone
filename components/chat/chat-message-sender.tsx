"use client"

import { MessageType } from "@prisma/client";
import axios from "axios";
import { Plus, Send } from "lucide-react"
import { FormEvent, useState } from "react"
import qs from 'query-string'
import { toast } from "sonner";
import { FileMessageModal } from "../dialogs/file-message-modal";
import { EmojiPicker } from "./chat-emoji-picker";
import { Skeleton } from "../ui/skeleton";

interface props {
    name: string;
    type: "conversation" | "channel";
    apiUrl: string,
    query: {
        channelId: string,
        serverId: string,
        userId: string
    }
}

export const ChatMessageSender = ({ name, type, apiUrl, query }: props) => {

    const [content, setContent] = useState('')
    const [isLoad, setIsLoad] = useState(false)

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault()
        if (!content) {
            toast.error('Invalid field')
            return
        }
        try {
            setIsLoad(true)

            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            const body = {content, messageType: MessageType.TEXT }

            const data = await axios.post(url, body, { withCredentials: true })
            if (data.data.success === true && data.status === 200) {
                toast.success("Message send")
                setContent('')
            } else {
                toast.error(data.data.message)
            }

        } catch {
            toast.error('Something went wrong')
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <div className="flex gap-3 md:gap-4 items-center border-t p-3 lg:p-4 dark:border-t-zinc-700">
            <EmojiPicker
                onChange={(emoji: string) => setContent(`${content}${emoji}`)}
            />
            <FileMessageModal
                apiUrl={apiUrl}
                query={query}
                type={type}
            >
                <button disabled={isLoad} className="aspect-square grid place-items-center bg-[#F2F3F5] dark:bg-zinc-700/75 p-1 lg:p-2 rounded-full">
                    <Plus className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition stroke-[2px]" />
                </button>
            </FileMessageModal>
            <form className="flex-1 flex items-center gap-2 md:gap-4" onSubmit={sendMessage}>
                <input
                    placeholder={`Message #${name}`}
                    value={content}
                    disabled={isLoad}
                    className="w-full text-sm md:text-base disabled:text-muted-foreground/70 border-none outline-none py-2 lg:py-3 px-4 bg-[#F2F3F5] dark:bg-zinc-700/75 rounded-full placeholder:text-sm"
                    onChange={(e) => setContent(e.target.value)}
                    required />

                <button type="submit" disabled={isLoad} className="disabled:opacity-30">
                    <Send className=" text-indigo-600 dark:text-indigo-300 stroke-[2px]" />
                </button>
            </form>
        </div>

    )

}

export const ChatBottomSkeleton = () => {
    return (
        <div className="flex gap-3 md:gap-4 items-center border-t p-3 lg:p-4 dark:border-t-zinc-700">
            <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-full" />
            <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-full" />
            <Skeleton className="flex-1 h-10 md:h-12 rounded-full" />
            <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-full" />
        </div>
    )
}