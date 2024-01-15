import { getServerdata } from "@/actions/server"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { ServerHeader, ServerHeaderSkeleton } from "./server-header"
import { ServerSearch, ServerSearchSkeleton } from "./server-search"
import { CircleUserIcon, Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ServerChannelList, ServerChannelListSkeleton } from "./server-channel-list"
import { Wrapper } from "../wrapper"


interface props {
    serverId: string
    userId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4 text-muted-foreground" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4 text-muted-foreground" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4 text-muted-foreground" />
};

const roleIconMap = {
    [MemberRole.GUEST]: <CircleUserIcon className="mr-2 h-4 w-4 text-muted-foreground" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}

export const ServerSideBar = async ({ serverId, userId }: props) => {

    const response = await getServerdata(serverId)
    if (!response || !response.success || !response.server) redirect('/')

    const textChannels = response.server.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = response.server.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = response.server.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = response.server.members.filter((member) => member.userId !== userId)

    const groupData = [{ data: textChannels, title: 'Text Channels' }, { data: audioChannels, title: 'Audio Channels' }, { data: videoChannels, title: 'Video Channels' }]

    const role = response.server.members.find((member) => member.userId === userId)?.role;

    return (
        <Wrapper classes="w-full md:w-80 md:min-w-80 dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={response.server} role={role} />
            <Separator className="h-0.5 rounded-md" />
            <ServerSearch
                data={[
                    {
                        label: 'Text Channels', 
                        type: 'channel',
                        data: textChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: 'Audio Channels',
                        type: 'channel',
                        data: audioChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: 'Video Channels',
                        type: 'channel',
                        data: videoChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: 'Members',
                        type: 'member',
                        data: members?.map((member) => ({
                            id: member.id,
                            name: member.user.username,
                            icon: roleIconMap[member.role],
                        }))
                    },
                ]}
            />
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md" />
            <ServerChannelList groupData={groupData} role={role || MemberRole.GUEST} />
        </Wrapper>
    )
}

export const ServerSideBarSkeleton = () => {
    return (
        <Wrapper classes="w-full md:w-80 dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeaderSkeleton />
            <Separator className="h-0.5 rounded-md" />
            <ServerSearchSkeleton />
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md" />
            <ServerChannelListSkeleton />
        </Wrapper>
    )
}