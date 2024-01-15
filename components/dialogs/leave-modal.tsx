"use client"

import { useTransition } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useRouter } from "next/navigation"
import { LeaveServer } from "@/actions/server"
import { toast } from "sonner"

interface props {
    serverName: string,
    serverId: string,
    children: React.ReactNode
}
export const LeaveModal = ({ serverName, serverId, children }: props) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const onLeave = () => {
        startTransition(() => {
            LeaveServer(serverId, serverName)
                .then((data) => {
                    if (data.success) {
                        toast.success(data.message)
                        router.replace('/')
                    } else {
                        toast.error(data.message)
                    }
                }).catch(() => toast.error("Something went wrong!!"))
        })
    }
    return (
        <Dialog>
            <DialogTrigger className="w-full">
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden text-black bg-white">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-8">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave <span className="font-semibold text-indigo-500">{serverName}</span>?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-between items-center bg-zinc-200 p-4 md:p-6">
                    <DialogClose>
                        <Button disabled={isPending} variant='ghost'>Cancel</Button>
                    </DialogClose>
                    <Button disabled={isPending} onClick={onLeave} variant='destructive'>Leave</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}