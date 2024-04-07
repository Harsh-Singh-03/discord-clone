"use client"

import { FormEvent, useEffect, useRef, useState, useTransition } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Channel, ChannelAccess, ChannelType } from "@prisma/client"
import { isValidName } from "@/lib/utils"
import { toast } from "sonner"
import { createChannelInServer, deleteChannel, updateChannelInfo } from "@/actions/channel"
import { usePathname } from "next/navigation"
import { Switch } from "../ui/switch"
import { Info } from "lucide-react"
import { useAppContext } from "../context"

interface props {
    serverId: string,
    children: React.ReactNode,
    channelData?: Channel
}
export const CreateNewChannel = ({ serverId, children, channelData }: props) => {

    const { sideBarData } = useAppContext()
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [type, setType] = useState<ChannelType>(ChannelType.TEXT)
    const [whoCanMessage, setWhoCanMessage] = useState<ChannelAccess>(ChannelAccess.EVERYONE)
    const [isPrivate, setIsPrivate] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)
    const path = usePathname()

    useEffect(() => {
        if (!!channelData) {
            setName(channelData.name)
            setCategoryId(channelData.categoryId)
            setType(channelData.type)
            setWhoCanMessage(channelData.whoCanMessage)
            setIsPrivate(channelData.isPrivate)
        }
    }, [channelData])

    const onCreate = () => {
        startTransition(() => {
            createChannelInServer({ serverId, name, type, path: path || '', isPrivate, whoCanAccess: whoCanMessage, categoryId })
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
    
    const onUpdate = () => {
        if(!channelData || !channelData.id){
            toast.error('invalid request')
            return 
        }
        startTransition(() => {
            updateChannelInfo({ serverId, values: {id: channelData.id, name, type,isPrivate, whoCanMessage: whoCanMessage, categoryId} })
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

    const onDelete = () => {
        if(!channelData || !channelData.id){
            toast.error('Invalid request')
            return
        }

        startTransition(() => {
            deleteChannel(channelData.id, serverId)
               .then((res) => {
                    if (res && res.success) {
                        toast.success(res.message)
                        closeRef.current?.click()
                    } else {
                        toast.error(res.message)
                    }
                }).catch((err) => {
                    toast.error('Internal Error')
                })
        })
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!categoryId) {
            toast.error('Select category')
            return
        }
        if (!isValidName(name) || !type) {
            toast.error('Invalid field')
            return
        }

        if(!!channelData && channelData.id){
            onUpdate()
        }else{
            onCreate()
        }
        
    }

    const titleText = !!channelData ? 'Update' : 'Create'

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="text-black bg-white p-0 overflow-hidden">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        {titleText} Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your channel a personality with a name and an type and set accessbility. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-col gap-2">
                        <Label className="font-medium" >Channel name:</Label>
                        <Input className="bg-zinc-300/50 border-0 site-input text-black focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Enter channel name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />

                        <Label className="font-medium mt-2" >Select Category:</Label>
                        <Select disabled={isPending} defaultValue={categoryId} onValueChange={(e: string) => setCategoryId(e)}>
                            <SelectTrigger className="w-full bg-zinc-300/50 border-0"  >
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black border-0">
                                <SelectGroup>
                                    <SelectLabel>Server Categories</SelectLabel>
                                    {sideBarData.map(item => {
                                        return (
                                            <SelectItem value={item.id} key={item.id}>{item.title}</SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

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
                                    <span>Select who can send messages, Only for text channels</span>
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

                    <div className="bg-gray-200 p-4 md:p-6 gap-2 flex justify-end">
                        {!!channelData && (
                            <Button variant='destructive' type='button' size='sm' onClick={onDelete} disabled={isPending}>Delete</Button>
                        )}
                        <Button variant='primary' size='sm' type="submit" disabled={isPending}>{titleText}</Button>
                    </div>
                </form>
                <DialogClose className="hidden">
                    <Button ref={closeRef} className="hidden">Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}