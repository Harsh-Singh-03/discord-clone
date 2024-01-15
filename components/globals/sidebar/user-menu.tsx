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

interface props {
    email: string;
    isEmailVerify: boolean;
    username: string;
    image: string;
    name: string
}
const Usermenu = ({ email, isEmailVerify, username, image, name }: props) => {

    const [isResetPassLoad, setIsResetPassLoad] = useState(false)
    const [isVerificationLoad, setIsVerificationLoad] = useState(false)

    const resetRequest = async () => {
        if (!email || !isEmail(email)) {
            return;
        }
        try {
            setIsResetPassLoad(true)
            const res = await resetPassRequest(email)
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
        if (!email || !isEmail(email)) {
            return;
        }
        try {
            setIsVerificationLoad(true)
            const res = await verifyEmail(email)
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
                    placeholder={name}
                    imageUrl={image || ''}
                    size='md'
                />
                <div>
                    <p className="font-medium text-base">{name}</p>
                    <p className="text-xs text-muted-foreground">@{username}</p>
                </div>
            </div>
            <Separator className="mt-3 mb-2" />
            <div className="my-2 w-full">
                <Button variant='ghost' className="w-full justify-start text-muted-foreground" asChild>
                    <Link href={`/u/${username}/settings`} className="gap-x-3 flex">
                        <UserCog className="w-4 h-4" />
                        <span>Manage Profile</span>
                    </Link>
                </Button>
                {!isEmailVerify && (
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