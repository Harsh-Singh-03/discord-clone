import { Plus} from "lucide-react"
import { ModeToggle } from "../toggle-mode"
import { CreateServer } from "@/components/dialogs/create-server"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarItem } from "./siderbar-item"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { baseUserType } from "@/lib/type"
import Usermenu from "./user-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wrapper } from "../wrapper"

interface props {
    user: baseUserType
}
export const SideBar = async ({ user }: props) => {
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    userId: user.id
                }
            }
        }
    });
    if (!servers) redirect('/')
    // console.log(servers)
    return (
        <Wrapper classes="dark:bg-dark1 bg-light1 w-[72px] py-3">
                <CreateServer>
                    <button
                        className="group flex items-center mx-auto">
                        <div className="flex w-12 h-12 rounded-full group-hover:rounded-2xl transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                            <Plus
                                className="group-hover:text-white transition text-emerald-500"
                                size={25}
                            />
                        </div>
                    </button>
                </CreateServer>
                <Separator className="bg-background dark:bg-zinc-700 my-4" />
                <ScrollArea className="flex-1 w-full flex flex-col">
                    {servers.map((server) => (
                        <div key={server.id} className="mb-2">
                            <SidebarItem
                                id={server.id}
                                name={server.name}
                                imageUrl={server.imageUrl}
                            />
                        </div>
                    ))}
                </ScrollArea>
                <Separator className="bg-background dark:bg-zinc-700 my-4" />
                <div className="space-y-4 flex flex-col">
                    <Popover>
                        <PopoverTrigger asChild className="hover:opacity-75">
                            <Avatar className="h-12 w-12 mx-auto cursor-pointer">
                                <AvatarImage src={user.image || ''} alt="user" className="bg-none" />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent side="right" className="px-2 pb-1">
                            <Usermenu user={user} />
                        </PopoverContent>
                    </Popover>
                    <ModeToggle />
                </div>
        </Wrapper>
    )
}

export const SideBarSkeleton = () => {
    return (
        <Wrapper classes="dark:bg-dark1 bg-light1 w-[72px] py-3">
            <Skeleton className="w-12 h-12 rounded-full mx-auto" />
            <Separator className="bg-background dark:bg-zinc-700 my-4" />
            <ScrollArea className="flex-1 w-full">
                {[...Array(6)].map((_, i) => (
                    <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" key={i} />
                ))}
            </ScrollArea>
            <Separator className="bg-background dark:bg-zinc-700 my-4" />
            <Skeleton className="w-12 h-12 rounded-full mb-4 mx-auto" />
            <Skeleton className="w-12 h-12 rounded-full mx-auto" />
       </Wrapper>
    )
}