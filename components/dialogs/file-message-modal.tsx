"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useSession } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { MessageType } from "@prisma/client";
import axios from "axios";
import { TooltipComponent } from "../globals/tooltip";
import { X } from "lucide-react";
import qs from 'query-string'

interface props {
    type: "conversation" | "channel";
    apiUrl: string,
    query: {
        channelId: string,
        serverId: string,
        userId: string
    },
    children: React.ReactNode
}

export const FileMessageModal = ({ type, apiUrl, query, children }: props) => {

    const session = useSession()
    const closeRef = useRef<HTMLButtonElement>(null)
    const [isLoad, setIsLoad] = useState(false)
    const [content, setContent] = useState('')

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if(!content){
            toast.error('Please upload an image first')
            return
        }
        try {
            setIsLoad(true)

            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            const body = {content, messageType: MessageType.FILE, userEmail: session.data?.user?.email }

            const data = await axios.post(url, body, { withCredentials: true })

            if(data.data.success === true && data.status === 200){
                toast.success("Message send")
                closeRef.current?.click()
                setContent('')
            }else{
                toast.error(data.data.message)
            }
        } catch {
            toast.error('Something went wrong')
        }finally{
            setIsLoad(false)
        }
    }

    const onRemove = () => {
        setContent('')
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 text-black bg-white overflow-hidden">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Upload Image
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                       Upload image to share within the channel.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2 grid place-items-center">
                        {content ?
                            <div className="aspect-square rounded-full relative w-full max-w-40">
                                <Image src={content} priority={true} alt="server-logo" fill className="object-cover rounded-full z-[-1]" />
                                <TooltipComponent label="Remove" position="left" variant="danger" >
                                    <Button variant="destructive" size='sm' className="p-0 hover:bg-destructive aspect-square z-10 rounded-full top-4 right-4" onClick={onRemove}>
                                        <X  className="w-4 h-4"/>
                                    </Button>
                                </TooltipComponent>
                            </div>
                            : (
                                <UploadDropzone
                                    endpoint="imgfile"
                                    className="mb-4 md:mb-6 border-2 py-6 w-full"
                                    onClientUploadComplete={(res) => {
                                        setContent(res?.[0].url || '');
                                        toast.success("Image uploaded now you can send it!!");
                                    }}
                                    onUploadError={() => {
                                        toast.error('something went wrong')
                                    }}
                                />
                            )}
                    </div>
                        <DialogFooter className="bg-gray-200 p-4 md:p-6">
                            <Button variant='primary' type="submit" disabled={isLoad || !content}>Send</Button>
                        </DialogFooter>
                </form>
                <DialogClose className="hidden">
                    <Button ref={closeRef} className="hidden">Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}