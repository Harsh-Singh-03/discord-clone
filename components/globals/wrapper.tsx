"use client"

import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"

interface props{
    children: React.ReactNode,
    classes: string
}

export const Wrapper = ({children, classes}: props) => {
    const params = useParams()
    return (
        <aside className={cn(
            "h-full flex flex-col border-r border-muted",
            params?.channelId && 'hidden md:flex',
            classes

        )}>
            {children}
        </aside>
    )
}