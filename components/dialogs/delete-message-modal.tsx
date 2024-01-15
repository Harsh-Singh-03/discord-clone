"use client"

import { useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { toast } from "sonner"
import qs from 'query-string'
import axios from "axios"

interface props {
    children: React.ReactNode,
    apiUrl: string,
    socketQuery: Record<string, string>,
}

export const DeleteMessageModal = ({ children, apiUrl, socketQuery }: props) => {

    const [isPending, setIsPending] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)

    const onDelete = async () => {
        setIsPending(true)
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: socketQuery,
        });
        try {
            const data = await axios.delete(url)
            if (data.data.success && data.status === 200) {
                toast.success("Message deleted")
                closeRef.current?.click()
            } else {
                toast.error(data.data.message)
            }
        } catch {
            toast.error('Somethign went wrong');
        }finally{
            setIsPending(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger className="w-full">
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden text-black bg-white">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-8">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete this <span className="font-semibold text-indigo-500">message</span>?
                        <br/>This action can not be undone
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-between items-center bg-zinc-200 p-4 md:p-6">
                    <DialogClose>
                        <Button ref={closeRef} variant='ghost'>Cancel</Button>
                    </DialogClose>
                    <Button disabled={isPending} onClick={onDelete} variant='destructive'>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}