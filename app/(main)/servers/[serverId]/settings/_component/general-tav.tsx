
"use client"

import { updateServerInfo } from "@/actions/server"
import { DeleteServerModal } from "@/components/dialogs/delete-server-modal"
import { TooltipComponent } from "@/components/globals/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone } from "@/lib/uploadthing"
import { isValidName } from "@/lib/utils"
import { Server } from "@prisma/client"
import { Trash } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChangeEvent, FormEvent, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

interface props {
    server: Server
}

type dataProp = {
    name: string
    imageUrl: string | null,
    bio: string | null,
}

export const GeneralTab = ({ server }: props) => {
    const [isPending, startTransition] = useTransition()
    const [data, setData] = useState<dataProp>({ name: '', bio: '', imageUrl: '' })
    const [isSave, setIsSave] = useState(false)
    const path = usePathname()

    useEffect(() => {
        setData({ name: server.name, bio: server.bio, imageUrl: server.imageUrl })
    }, [server])

    const onRemove = () => {
        setData({ ...data, imageUrl: null })
    }

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (server.name !== e.target.value && server.bio !== e.target.value && e.target.value !== '') {
            setIsSave(true)
        } else {
            setIsSave(false)
        }

        setData({ ...data, [e.target.name]: e.target.value })
    }

    const onUpdate = (url: string | undefined | null) => {
        if (!url) {
            toast.error('Something went wrong!')
            return;
        }
        startTransition(() => {
            updateServerInfo({ serverId: server.id, path: path || '/', values: { imageUrl: url } })
                .then((res) => {
                    if (res.success) {
                        toast.success("Server info updated!");
                        setData({ ...data, imageUrl: url })
                    } else {
                        toast.error(res.message)
                    }
                })
                .catch(() => toast.error("Something went wrong"))
        })
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!data.name || !isValidName(data.name)) {
            toast.error("Enter valid name!")
            return
        }

        if (data.name === server.name && (data.bio === server.bio || data.bio === '')) {
            return;
        }

        startTransition(() => {
            updateServerInfo({
                serverId: server.id, path: path || '/', values: {
                    name: data.name,
                    bio: data.bio
                }
            })
                .then((res) => {
                    if (res.success) {
                        toast.success("Server details updated");
                    } else {
                        toast.error(res.message)
                    }
                })
                .catch(() => toast.error("Something went wrong"))
        })
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between flex-col md:flex-row gap-4">
                <h2 className="text-xl font-semibold tracking-wide flex-1">General Settings :-</h2>
                <div className="flex items-center justify-end gap-4">
                    <DeleteServerModal serverId={server.id} serverName={server.name} >
                        <Button variant='destructive' size='sm'>Delete Server</Button>
                    </DeleteServerModal>
                </div>
            </div>

            <form className="space-y-4 mt-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Name</p>
                    <Input
                        placeholder="Enter server name..."
                        required
                        name="name"
                        disabled={isPending}
                        value={data.name}
                        onChange={onChange}
                        minLength={3}
                        className="resize-none rounded-md border-zinc-300 dark:border-white/20 bg-zinc-50 dark:bg-zinc-600/75"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Bio</p>
                    <Textarea
                        placeholder="Enter server bio..."
                        name="bio"
                        disabled={isPending}
                        value={data.bio || ""}
                        onChange={onChange}
                        className="resize-none rounded-md border-zinc-300 dark:border-white/20 bg-zinc-50 dark:bg-zinc-600/75"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Image
                    </p>
                    {data.imageUrl ? (
                        <div className="relative md:max-w-xs aspect-video rounded-xl overflow-hidden border border-white/10">
                            <div className="absolute top-2 right-2 z-[10]">
                                <TooltipComponent label="Remove thumbnail" position="left" variant="danger">
                                    <Button
                                        type="button"
                                        disabled={isPending}
                                        onClick={onRemove}
                                        className="h-auto w-auto p-1.5"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TooltipComponent>
                            </div>
                            <Image
                                alt="Thumbnail"
                                src={data.imageUrl}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full overflow-x-hidden">
                            <UploadDropzone
                                className="dark:border-white/20 border-zinc-200 border-2 w-full"
                                endpoint="imgfile"
                                onClientUploadComplete={(res: any) => {
                                    onUpdate(res?.[0]?.url);
                                }}

                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        disabled={isPending || !isSave}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}