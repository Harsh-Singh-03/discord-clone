"use client"


import { resetPassRequest, updateEmailOfUser, updateUsernameById } from "@/actions/user"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { isEmail, isValidUsername } from "@/lib/utils"
import { Info } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FormEvent, useState, useTransition } from "react"
import { toast } from "sonner"
import { TooltipComponent } from "./tooltip"

interface props {
    id: string,
    initialUsername: string,
    initialEmail: string,
}
export const CredentialsTab = ({ id, initialEmail, initialUsername }: props) => {
    const [isPending, startTransition] = useTransition()
    const [email, setEmail] = useState(initialEmail)
    const [username, setUsername] = useState(initialUsername)
    const router = useRouter()

    const onSubmitEmail = (e: FormEvent) => {
        e.preventDefault()
        if (email === initialEmail) return
        if (!isEmail(email)) {
            toast.error('Inavaild email')
            return
        }
        startTransition(() => {
            updateEmailOfUser(email)
                .then((data) => {
                    if (data.success) {
                        toast.success(data.message)
                        signOut()
                    } else {
                        toast.error("Something went wrong")
                    }
                }).catch(() => {
                    toast.error('Something went wrong!+')
                })
        })

    }

    const onSubmitUsername = (e: FormEvent) => {
        e.preventDefault()
        if (username === initialUsername) return
        if (!isValidUsername(username)) {
            toast.error('Inavaild username')
            return
        }
        startTransition(() => {
            updateUsernameById(username)
                .then((data) => {
                    if (data.success) {
                        toast.success('Username updated!')
                        router.refresh()
                    } else {
                        toast.error("Something went wrong")
                    }
                }).catch(() => {
                    toast.error('Something went wrong!+')
                })
        })

    }

    const resetRequest = async () => {
        if (!email || !isEmail(email)) {
            toast.error('Invalid email to send url for your request')
            return;
        }
        startTransition(() => {
            resetPassRequest(email)
            .then((res) => {
                if (res && res.success) {
                    toast.success(res.message)
                } else {
                    toast.error(res.message)
                }
            }).catch(() => {
                toast.error("Something went wrong!")
            })
        })
    }

    return (
        <div className="rounded-md p-4 md:p-6">
             <div className="flex gap-3 justify-end items-center">
                <TooltipComponent label="Will sent an email for reset pass">
                    <Info className="text-muted-foreground w-5 h-5" />
                </TooltipComponent>
                <Button variant='primary' disabled={isPending} size='sm' onClick={resetRequest}>Reset Password</Button>
                <Button variant='destructive' disabled={isPending} size='sm' onClick={() => signOut()}>Logout</Button>
            </div>
            <form className="mb-4" onSubmit={onSubmitEmail}>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Email</p>
                    <Input
                        placeholder="example@gmail.com"
                        type="email"
                        required
                        disabled={isPending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="resize-none border-zinc-300 rounded-md dark:border-white/20 bg-muted dark:bg-zinc-600/75"
                    />
                    {initialEmail !== email && (
                        <div className="w-full grid place-items-end">
                            <Button type="submit" disabled={isPending} variant='primary' size='sm'>Save</Button>
                        </div>
                    )}
                </div>
            </form>
            <form onSubmit={onSubmitUsername}>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Username</p>
                    <Input
                        placeholder="Enter username"
                        required
                        disabled={isPending}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={3}
                        maxLength={30}
                        className="resize-none rounded-md border-zinc-300 dark:border-white/20 bg-muted dark:bg-zinc-600/75"
                    />
                    <div className="flex items-center gap-2 text-muted-foreground ml-2">
                        <Info className='w-4 h-4' />
                        <p className='text-[10px]'>Allowed: ( _ , _ ) , lowercase and 5-30 charcter range</p>
                    </div>
                    {initialUsername !== username && (
                        <div className="w-full grid place-items-end">
                            <Button type="submit" disabled={isPending} variant='primary' size='sm'>Save</Button>
                        </div>
                    )}
                </div>
            </form>
            <DialogClose asChild className="mt-4 md:mt-6">
                <Button type="button" variant="ghost" size='sm' className="hover:bg-background">
                    Close
                </Button>
            </DialogClose>
        </div>
    )
}