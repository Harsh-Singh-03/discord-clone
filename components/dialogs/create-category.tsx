"use client"

import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import React, { FormEvent, useRef, useState, useTransition } from "react"
import { isValidName } from "@/lib/utils"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { createCategoryInServer } from "@/actions/category"

export const CreateCategory = ({ children, serverId }: { children: React.ReactNode, serverId: string }) => {
    const [title, setTitle] = useState("")
    const [isPending, startTransition] = useTransition()
    const closeRef = useRef<HTMLButtonElement>(null)
    const path = usePathname()

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!isValidName(title)) {
            toast.error('Invalid field!')
            return
        }
        startTransition(() => {
            createCategoryInServer(title, serverId, path || '')
            .then((data) => {
                if(data.success){
                    toast.success(data.message)
                    setTitle('')
                    closeRef.current?.click()
                }else{
                    toast.error(data.message)
                }
            }).catch(() => toast.error("Something went wrong"))
        })
       
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 text-black bg-white overflow-hidden">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Category
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                       Create category to organize your channels in the server 
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
                        <Label className="font-medium" >Category title:</Label>
                        <Input className="bg-zinc-300/50 border-0 site-input text-black focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Enter category title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} />
                    </div>
                    <DialogFooter className="bg-gray-200 p-4 md:p-6">
                        <Button variant='primary' type="submit" disabled={isPending}>Create</Button>
                    </DialogFooter>
                </form>
                <DialogClose className="hidden">
                    <Button ref={closeRef} className="hidden">Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}