"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { isEmail } from "@/lib/utils";
import { Loader2, LogOut, MailWarning, ShieldQuestion, UserCog } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "../user-avatar";
import { resetPassRequest, verifyEmail } from "@/actions/user";
import { UserModal } from "@/components/dialogs/manage-profile";
import { baseUserType } from "@/lib/type";

interface props {
    user: baseUserType
}
const Usermenu = ({ user }: props) => {

    const [isResetPassLoad, setIsResetPassLoad] = useState(false)
    const [isVerificationLoad, setIsVerificationLoad] = useState(false)

    const resetRequest = async () => {
        if (!user.email || !isEmail(user.email)) {
            return;
        }
        try {
            setIsResetPassLoad(true)
            const res = await resetPassRequest(user.email)
            if (res && res.success) {
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        } catch (error: any) {
            toast.error('Server error please try again later!')
        } finally {
            setIsResetPassLoad(false)
        }
    }

    const verificationReq = async () => {
        if (!user.email || !isEmail(user.email)) {
            return;
        }
        try {
            setIsVerificationLoad(true)
            const res = await verifyEmail(user.email)
            if (res && res.success) {
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        } catch (error: any) {
            toast.error("Server error please try again letter!")
        } finally {
            setIsVerificationLoad(false)
        }
    }

    return (
        <div className="w-full">
            <div className="flex gap-4 items-center px-2">
                <UserAvatar
                    placeholder={user.name}
                    imageUrl={user.image || ''}
                    size='md'
                />
                <div>
                    <p className="font-medium text-base">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
            </div>
            <Separator className="mt-3 mb-2" />
            <div className="my-2 w-full">
                <UserModal user={user}>
                    <Button variant='ghost' className="w-full flex gap-x-3 justify-start text-muted-foreground">
                        <UserCog className="w-4 h-4" />
                        <span>Manage Profile</span>
                    </Button>
                </UserModal>
                {!user.isEmailVerified && (
                    <Button variant='ghost' className="gap-x-3 w-full justify-start text-muted-foreground" disabled={isVerificationLoad} onClick={verificationReq}>
                        {isVerificationLoad ? <Loader2 className="w-4 h-4 animate-spin" /> : <MailWarning className="w-4 h-4" />}
                        <span>Verify your email</span>
                    </Button>
                )}
                <Button variant='ghost' className="gap-x-3 w-full justify-start text-muted-foreground" disabled={isResetPassLoad} onClick={resetRequest}>
                    {isResetPassLoad ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldQuestion className="w-4 h-4" />}
                    <span>Reset password</span>
                </Button>
                <Separator className="w-full my-2" />
                <Button variant='ghost' className="gap-x-3 w-full justify-start text-muted-foreground" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </Button>
            </div>
        </div>
    )
}

export default Usermenu