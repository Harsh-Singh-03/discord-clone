"use client"

import { useRef, useState, useTransition } from "react"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { MemberRole } from "@prisma/client"
import { Separator } from "../ui/separator"
import { useMembers } from "../context/member-context"
import { removeMember, updateRole } from "@/actions/server"
import { toast } from "sonner"

export const UpdateMemberModal = ({ children, serverId, memberId }: { children: React.ReactNode, memberId: string, serverId: string }) => {

    const closeRef = useRef<HTMLButtonElement>(null)

    const [role, setRole] = useState<MemberRole | ''>('')
    const [isPending, startTransition] = useTransition()
    const { membersData, setmembersData } = useMembers()

    const onKick = async () => {
        console.log(serverId)
        startTransition(() => {
            removeMember({serverId, memberId})
            .then((data) => {
                if(data.success){
                    toast.success(data.message)
                    const updatedMembers = membersData.filter((member) => member.id !== memberId);
                    setmembersData(updatedMembers);
                    closeRef.current?.click()
                }else{
                    toast.error(data.message)
                }
            }).catch((err) => toast.error("Internal server error"))
        })
    }
    
    const onRole = async () => {
        if (!role) return

        startTransition(() => {
            updateRole({serverId, memberId, role})
            .then((data) => {
                if(data.success){
                    toast.success(data.message)
                    const updatedMembers = membersData.map((member) =>
                        member.id === memberId ? { ...member, role: role } : member
                    );
                    setmembersData(updatedMembers);
                    closeRef.current?.click()
                }else{
                    toast.error(data.message)
                }
            }).catch((err) => toast.error("Internal server error"))
        })

    }


    return (
        <Dialog>

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="p-0 text-black bg-white overflow-hidden">

                <DialogHeader>
                    <DialogTitle className="px-4 pt-4">
                        Member Action
                    </DialogTitle>
                </DialogHeader>

                <Separator className="bg-zinc-300" />

                <div className="p-4 grid gap-2 pt-2">
                    <Label className="font-medium" >Select role:</Label>
                    <Select disabled={isPending} onValueChange={(e: MemberRole) => setRole(e)} value={role}>
                        <SelectTrigger className="w-full bg-zinc-300/50 border-0"  >
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black border-0">
                            <SelectGroup>
                                <SelectItem value={MemberRole.GUEST} >{MemberRole.GUEST}</SelectItem>
                                <SelectItem value={MemberRole.MODERATOR} > {MemberRole.MODERATOR} </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-4 items-center bg-zinc-200 p-4">
                    <Button variant="primary" size='sm' disabled={isPending || !role} onClick={onRole}>
                        Update role
                    </Button>
                    <Button variant="destructive" size='sm' disabled={isPending} onClick={onKick}>
                        Kick
                    </Button>
                    <div className="hidden">
                        <DialogClose>
                            <button ref={closeRef} >Close</button>
                        </DialogClose>
                    </div>
                </div>

            </DialogContent>

        </Dialog>
    )
}