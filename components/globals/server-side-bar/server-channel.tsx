"use client";

import {
    Channel,
    ChannelAccess,
    ChannelType,
    MemberRole,
} from "@prisma/client";

import { Hash, Lock, Mic, Video } from "lucide-react";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface ServerChannelProps {
    channel: Channel;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}

export const ServerChannel = ({
    channel,
    role
}: ServerChannelProps) => {

    const params = useParams();
    const Icon = iconMap[channel.type];

    return (
        <Link
            href={`/servers/${params?.serverId}/channels/${channel.id}`}
            className={cn(
                "group p-2 rounded-md flex justify-between items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <div className="flex items-center gap-x-2">
                <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                <p className={cn(
                    "line-clamp-1 font-medium text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}>
                    {channel.name}
                </p>
            </div>
            {channel.isPrivate || (channel.type === ChannelType.TEXT && channel.whoCanMessage !== ChannelAccess.EVERYONE) ? (
                <Lock className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            ): <></>}
        </Link>
    )
}