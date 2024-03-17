import { getServerdata } from "@/actions/server"
import { MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { ServerHeader, ServerHeaderSkeleton } from "./server-header"
import { ServerSearchSkeleton } from "./server-search"
import { Separator } from "@/components/ui/separator"
import { ServerChannelList, ServerChannelListSkeleton } from "./server-channel-list"
import { Wrapper } from "../wrapper"


interface props {
    serverId: string
    userId: string
}

export const ServerSideBar = async ({ serverId, userId }: props) => {

    const response = await getServerdata(serverId, userId)
    if (!response || !response.success || !response.server) redirect('/')
    const role = response.server.members[0].role

    return (
        <Wrapper classes="w-full md:w-80 md:min-w-80 dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={response.server} role={role} />
            <Separator className="h-0.5 rounded-md" />
        
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md" />
            <ServerChannelList groupData={response.server.Category} role={role || MemberRole.GUEST} />
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