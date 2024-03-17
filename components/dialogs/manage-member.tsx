"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { baseUserType } from "@/lib/type"
import { Member } from "@prisma/client"

import { getServerMember } from "@/actions/server"
import { toast } from "sonner"
import { Separator } from "../ui/separator"
import { MemberData } from "../globals/server-side-bar/member-data"
import { useMembers } from "../context/member-context"
import { Loader2 } from "lucide-react"

interface props {
    children: React.ReactNode,
    serverId: string,
    serverName: string,
    you: Member & ({ user: baseUserType }),
    member_count: number
}

export const ManageMemberDialog = ({ children, serverId, serverName, you, member_count }: props) => {

    const closeRef = useRef<HTMLButtonElement>(null)
    const [isLoad, setIsLoad] = useState(false)
    const { membersData, setmembersData } = useMembers()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState(1)

    useEffect(() => {
        const timeout = setTimeout(() => {
            const getMembers = async () => {
                try {
                    setIsLoad(true)
                    const res = await getServerMember({ serverId, userId: you.userId, search, page })
                    console.log(res)
                    if (res.success) {
                        // toast.success(res.message)
                        setmembersData(res.members || [])
                    } else {
                        toast.error(res.message)
                    }
                } catch {
                    toast.error('Internal server error')
                } finally {
                    setIsLoad(false)
                }
            }
            if (serverId && you.id) {
                getMembers()
            }
        }, 600);

        return (() => clearTimeout(timeout))


    }, [serverId, you.id, search])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 text-black bg-white overflow-hidden max-w-screen-md">
                <DialogHeader className="px-4 md:px-6 pt-4">
                    <DialogTitle className="text-xl lg:text-2x font-bold">
                        Manage {serverName}'s members
                    </DialogTitle>
                </DialogHeader>

                <Separator className="bg-zinc-300" />

                {isLoad && (
                    <div className="flex flex-col flex-1 justify-center items-center my-6">
                        <Loader2 className="h-7 w-7 text-zinc-400 animate-spin mb-2" />
                        <p className="text-xs text-zinc-400">
                            Loading members...
                        </p>
                    </div>
                )}

                {!isLoad && (
                    <>
                        <div className="px-4 pb-2">
                            {/* Search form */}
                            <Input className="bg-zinc-300/50 border-0 site-input text-black focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Search members" onChange={(e) => setSearch(e.target.value)} />
                            {/* member list */}
                            <div className="grid gap-4 mt-4">
                                <MemberData member={you} isAdmin={you.role} serverId={serverId} />
                                <Separator className="bg-zinc-200" />
                                {membersData.map((el, i) => {
                                    return (
                                        <MemberData member={el} key={i} isAdmin={you.role} serverId={serverId} />
                                    )
                                })}
                                {membersData.length === 0 && (
                                    <p className="text-sm text-center text-gray-500">No member found</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button
                                variant='primary'
                                size='sm'
                                disabled={page < 2}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </Button>
                            <Button
                                variant='primary'
                                size='sm'
                                disabled={member_count > (((page - 1) * 25) + membersData.length)}
                                onClick={() => setPage(page + 1)} >
                                Next
                            </Button>
                        </div>
                    </>
                )}


                <div className="flex justify-end items-center bg-zinc-200 p-4 md:p-6">
                    <DialogClose>
                        <Button ref={closeRef} variant='secondary'>Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}