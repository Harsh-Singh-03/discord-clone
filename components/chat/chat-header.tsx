import { Hash } from "lucide-react"
import { Back } from "../globals/back"
import { UserAvatar } from "../globals/user-avatar"
import { SocketIndicator } from "../globals/socket-indicator"
import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"

interface props {
    type: 'channel' | 'conversation',
    name: string,
    image?: string,
    serverId: string
}
export const ChatHeader = ({ name, image, type, serverId }: props) => {
    return (
        <div className="text-md font-semibold px-4 flex items-center absolute top-0 left-0 h-12 w-full">
            <Back serverId={serverId} />
            {type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "conversation" && (
                <UserAvatar
                    placeholder={name}
                    imageUrl={image || ''}
                    size='default'
                />
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    )
}

export const ChatHeaderSkeleton = () => {
    return (
        <>
            <div className="text-md font-semibold px-4 flex items-center h-12">
                <Skeleton className="w-[160px] h-5 rounded-md" />
                <Skeleton className="w-16 h-3.5 rounded-md ml-auto" />
            </div>
            <Separator className="h-0.5 rounded-md" />
        </>
    )
}