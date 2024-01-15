"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import React, { FormEvent, useRef, useState, useTransition } from "react"
import { isValidName } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"
import { createServer } from "@/actions/server"
import { useRouter } from "next/navigation"
import { TooltipComponent } from "../globals/tooltip"
import { X } from "lucide-react"

export const CreateServer = ({ children }: { children: React.ReactNode }) => {
    const [imageUrl, setImageUrl] = useState("")
    const [name, setName] = useState("")
    const [isPending, startTransition] = useTransition()
    const closeRef = useRef<HTMLButtonElement>(null)
    const router = useRouter()

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!imageUrl || !isValidName(name)) {
            toast.error('Invalid name or image field!')
            return
        }
        startTransition(() => {
            createServer(name, imageUrl)
                .then((data) => {
                    if (data.success) {
                        toast.success(data.message)
                        setName('')
                        setImageUrl('')
                        closeRef.current?.click()
                        router.refresh()
                    } else {
                        toast.success(data.message || 'Something went wrong!')
                    }
                }).catch(() => { toast.error('Something went wrong!') })
        })
    }

    const onRemove = () => {
        setImageUrl("")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 text-black bg-white overflow-hidden">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
                        {imageUrl ?
                            <div className="aspect-square rounded-full relative w-full max-w-40 mx-auto">
                                <Image src={imageUrl} priority={true} alt="server-logo" fill className="object-cover rounded-full z-[-1]" />
                                <TooltipComponent label="Remove" position="left" variant="danger" >
                                    <Button variant="destructive" size='sm' className="p-0 hover:bg-destructive aspect-square z-10 rounded-full top-4 right-4" onClick={onRemove}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </TooltipComponent>
                            </div>
                            : (
                                <UploadDropzone
                                    endpoint="imgfile"
                                    className="mb-4 md:mb-6 border-2 py-6 w-full"
                                    onClientUploadComplete={(res) => {
                                        setImageUrl(res?.[0].url || '');
                                        toast.success("Image uploaded now you can submit form !!");
                                    }}
                                    onUploadError={() => {
                                        toast.error('something went wrong')
                                    }}
                                />
                            )}
                        <Label className="font-medium" >Server name:</Label>
                        <Input className="bg-zinc-300/50 border-0 site-input text-black focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Enter server name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
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