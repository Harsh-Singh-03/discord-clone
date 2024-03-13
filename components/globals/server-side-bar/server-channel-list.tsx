import { Category, Channel, MemberRole } from "@prisma/client"
import { ServerChannel } from "./server-channel"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface props {
    groupData: (Category & {channels: Channel[], _count: {channels: number}})[],
    role: MemberRole
}

export const ServerChannelList = ({ groupData, role }: props) => {

    let defaultOpen: string[] = []

    return (
        <ScrollArea className="flex-1 px-4">
            {groupData.map((data, index) => {
                defaultOpen = defaultOpen.concat(`item-${index}`)
                return (
                    <div key={index} className="w-full">
                        {!!data.channels.length && (
                            <Accordion type="multiple" defaultValue={defaultOpen} className="w-full" >
                                <AccordionItem value={`item-${index}`} className="py-2 border-b-zinc-200 dark:border-b-zinc-700">
                                    <AccordionTrigger className="py-0">
                                        <p className="py-2 text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400">
                                            {data.title}
                                        </p>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-0">
                                        <div className="space-y-[2px]">
                                            {data.channels.map((channel) => {
                                                const isChannelHide = channel.isPrivate === true && role === MemberRole.GUEST
                                                if(isChannelHide){
                                                    return null
                                                }
                                                return (
                                                    <ServerChannel
                                                        key={channel.id}
                                                        channel={channel}
                                                        role={role}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}
                    </div>
                )
            })}
        </ScrollArea>
    )
}

export const ServerChannelListSkeleton = () => (
    <ScrollArea className="flex-1 w-full px-4">
        {[...Array(3)].map((_, i) => (
            <div className="w-full mt-4" key={i}>
                <div className="flex justify-between items-center my-6">
                    <Skeleton className="w-[70%] h-4 rounded-md" />
                    <Skeleton className="w-6 h-4 rounded-md" />
                </div>
                <div className="pl-4 space-y-6 mb-6">
                    <Skeleton className="w-[90%] h-4 rounded-md" />
                    <Skeleton className="w-[90%] h-4 rounded-md" />
                    <Skeleton className="w-[90%] h-4 rounded-md" />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md" />
            </div>
        ))}
    </ScrollArea>
)