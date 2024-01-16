"use client"

import { FormEvent, useRef, useState, useTransition } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { ChannelAccess, ChannelType } from "@prisma/client"
import { isValidName } from "@/lib/utils"
import { toast } from "sonner"
import { createChannelInServer } from "@/actions/channel"
import { usePathname } from "next/navigation"
import { Switch } from "../ui/switch"
import { Info } from "lucide-react"

interface props {
    serverId: string,
    children: React.ReactNode
}
export const CreateNewChannel = ({ serverId, children }: props) => {

    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState("")
    const [type, setType] = useState<ChannelType>(ChannelType.TEXT)
    const [whoCanMessage, setWhoCanMessage] = useState<ChannelAccess>(ChannelAccess.EVERYONE)
    const [isPrivate, setIsPrivate] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)
    const path = usePathname()

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!isValidName(name) || !type) {
            toast.error('Invalid field')
            return
        }
        startTransition(() => {
            createChannelInServer({ serverId, name, type, path: path || '', isPrivate, whoCanAccess: whoCanMessage })
                .then((data) => {
                    if (data.success) {
                        toast.success(data.message)
                        setName("")
                        closeRef.current?.click()
                    } else {
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
            <DialogContent className="text-black bg-white p-0 overflow-hidden">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your channel a personality with a name and an type and set accessbility. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-col gap-2">
                        <Label className="font-medium" >Channel name:</Label>
                        <Input className="bg-zinc-300/50 border-0 site-input text-black focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Enter server name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />

                        <Label className="font-medium mt-2" >Channel Type:</Label>
                        <Select disabled={isPending} onValueChange={(e: ChannelType) => setType(e)} defaultValue={type}>
                            <SelectTrigger className="w-full bg-zinc-300/50 border-0"  >
                                <SelectValue placeholder="Select channel type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black border-0">
                                <SelectGroup>
                                    <SelectLabel>Channel Type</SelectLabel>
                                    <SelectItem value={ChannelType.TEXT}>Text</SelectItem>
                                    <SelectItem value={ChannelType.AUDIO}>Audio</SelectItem>
                                    <SelectItem value={ChannelType.VIDEO}>Video</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {type === ChannelType.TEXT && (
                            <>
                                <Label className="font-medium mt-2" >Who can message:</Label>
                                <Select disabled={isPending} defaultValue={whoCanMessage} 
                                  onValueChange={(e: ChannelAccess) => setWhoCanMessage(e)}
                                 >
                                    <SelectTrigger className="w-full bg-zinc-300/50 border-0"  >
                                        <SelectValue placeholder="Select who can message" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black border-0">
                                        <SelectGroup>
                                            <SelectLabel>Who can message</SelectLabel>
                                            <SelectItem value={ChannelAccess.EVERYONE}>Everyone</SelectItem>
                                            <SelectItem value={ChannelAccess.MODS}>Admin & Moderator only</SelectItem>
                                            <SelectItem value={ChannelAccess.ADMIN_ONLY}>Admin only</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-x-2 text-zinc-500 text-xs">
                                    <Info className="w-4 h-4" />
                                    <span>Select who can message to this channel only for text channels</span>
                                </div>
                            </>
                        )}

                        <div className="flex items-center mt-2 justify-between w-full">
                            <Label className="font-medium" >Is Private ?</Label>
                            <Switch disabled={isPending} defaultChecked={isPrivate} onCheckedChange={(e) => setIsPrivate(e)} />
                        </div>
                        <div className="flex gap-x-2 text-zinc-500 text-xs">
                            <Info className="w-4 h-4" />
                            <span>If the channel is private only admin & mods can view or access the channel</span>
                        </div>
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