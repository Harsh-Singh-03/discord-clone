"use client"

import { useRef, useTransition } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { deleteServer } from "@/actions/server"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface props {
    children: React.ReactNode,
    serverName: string,
    serverId: string
}

export const DeleteServerModal = ({ children, serverId, serverName }: props) => {

    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const closeRef = useRef<HTMLButtonElement>(null)


    const onDelete = () => {
        startTransition(() => {
            deleteServer(serverId)
                .then((data) => {
                    if (data.success) {
                        toast.success(`${serverName} deleted successfully!!`)
                        closeRef.current?.click()
                        router.replace('/')
                        router.back()
                    } else {
                        toast.error(data.message)
                    }
                }).catch(() => toast.error("Something went wrong!!"))
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="w-full" asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden text-black bg-white">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-8">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete <span className="font-semibold text-indigo-500">{serverName}</span>?
                        <br/>This action can not be undone
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-between items-center bg-zinc-200 p-4 md:p-6">
                    <DialogClose>
                        <Button disabled={isPending} ref={closeRef} variant='ghost'>Cancel</Button>
                    </DialogClose>
                    <Button disabled={isPending} onClick={onDelete} variant='destructive'>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}