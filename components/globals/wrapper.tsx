"use client"

import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation"

interface props{
    children: React.ReactNode,
    classes: string
}

export const Wrapper = ({children, classes}: props) => {
    const params = useParams()
    const path = usePathname()
    const isHide = path === `/servers/${params?.serverId}/settings` || !!params?.channelId

    return (
        <aside className={cn(
            "h-full flex flex-col border-r border-muted",
            isHide && 'hidden md:flex',
            classes

        )}>
            {children}
        </aside>
    )
}