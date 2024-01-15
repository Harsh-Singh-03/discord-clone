"use client"

import { Member } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import { MessageWithMemberWithProfile } from "@/lib/type";
import { ChatItem } from "./chat-item";
import { format } from 'date-fns'
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export const ChatMessages = ({ name, member, chatId, socketUrl, socketQuery, paramKey, paramValue, type }:
    ChatMessagesProps) => {

    const chatRef = useRef<ElementRef<'div'>>(null)
    const bottomRef = useRef<ElementRef<'div'>>(null)

    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
            useChatQuery({ queryKey, paramKey, channelId: paramValue });

    useChatSocket({queryKey, addKey, updateKey})
    
    useChatScroll({
        bottomRef,
        chatRef, 
        loadMore: fetchNextPage, 
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage, 
        count: data?.pages[0].items?.length ?? 0 
    })

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto md:px-3" ref={chatRef}>
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && (
                <ChatWelcome
                    type={type}
                    name={name}
                />
            )}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                        >
                            Load previous messages
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((group, i) => {
                    return (
                        <Fragment key={i}>
                            {group.items?.map((message: MessageWithMemberWithProfile) => {
                                const createdAt = new Date(message.createdAt);
                                const updatedAt = new Date(message.updatedAt);
                                const isUpdated = createdAt.getTime() !== updatedAt.getTime()
                                return (
                                    <ChatItem
                                        content={message.content}
                                        currentMember={member}
                                        key={message.id}
                                        isUpdated={isUpdated}
                                        member={message.member}
                                        messageType={message.messageType}
                                        socketQuery={socketQuery}
                                        socketUrl={socketUrl}
                                        isDeleted={message.isDeleted}
                                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                        id={message.id}
                                    />
                                )
                            })}
                        </Fragment>
                    )
                })}
            </div>
            <div ref={bottomRef}/>
        </div>
    )
}