"use client"

import { ArrowLeftFromLine } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export const Back = ({ serverId }: { serverId: string }) => {
    const router = useRouter()
    const backWords = () => {
        if (serverId) {
            router.push(`/servers/${serverId}`)
        }
        else {
            router.back()
        }
    }
    return (
        <button onClick={backWords} className={cn(
            "text-muted-foreground hover:text-black dark:hover:text-white mr-4 transition", serverId && 'inline-flex md:hidden'
        )}>
            <ArrowLeftFromLine className="w-5 h-5" />
        </button>
    )
}