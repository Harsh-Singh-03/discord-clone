"use client"

import { UpdateMemberModal } from "@/components/dialogs/update-member"
import { baseUserType } from "@/lib/type"
import { cn } from "@/lib/utils"
import { Member, MemberRole } from "@prisma/client"
import { CircleUserIcon, Edit, ShieldAlert, ShieldCheck } from "lucide-react"

interface props {
    member: Member & ({ user: baseUserType }),
    isAdmin: MemberRole,
    serverId: string
}
const roleIconMap = {
    [MemberRole.GUEST]: <CircleUserIcon className="mr-2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 mr-2 text-rose-500" />
}
const colorMap = {
    [MemberRole.GUEST]: "text-gray-700",
    [MemberRole.MODERATOR]: "text-indigo-500",
    [MemberRole.ADMIN]: "text-rose-500"
}

export const MemberData = ({ member, isAdmin, serverId }: props) => {

    const access = isAdmin === MemberRole.ADMIN && member.role !== isAdmin

    return (
        <div className="flex justify-between items-center">

            <div className="flex items-center">
                {roleIconMap[member.role]}
                <h4 className="text-indigo-500 text-sm md:text-base font-semibold">{member.user.username}</h4>
            </div>

            <span className={cn(
                "text-xs md:text-sm font-medium",
                colorMap[member.role]
            )}>
                #{member.role}
            </span>

            {access && (
                <UpdateMemberModal memberId={member.id} serverId={serverId}>
                    <button className="px-2md:px-3">
                        <Edit className="w-4 h-4 text-indigo-500 hover:text-indigo-300 transition-all" />
                    </button>
                </UpdateMemberModal>
            )}
        </div>
    )
}