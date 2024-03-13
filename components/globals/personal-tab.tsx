"use client"

import { ElementRef, FormEvent, useRef, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { TooltipComponent } from "./tooltip";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { DialogClose } from "../ui/dialog";
import { updateUserField } from "@/actions/user";
import { toast } from "sonner";
import { isValidName } from "@/lib/utils";

interface props {
    initialImage: string | null | undefined
    initialName: string
}
export const PersonalTab = ({ initialImage, initialName }: props) => {
    const closeRef = useRef<ElementRef<"button">>(null);
    const [name, setName] = useState(initialName);
    const [image, setImage] = useState(initialImage || '');
    const [isPending, startTransition] = useTransition()

    const onRemove = () => {
        startTransition(() => {
            updateUserField({ image: null })
                .then(() => {
                    toast.success("Profile photo removed");
                    setImage("");
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Something went wrong"));
        });
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        if(!name || !isValidName(name) || name === initialName) {
            closeRef?.current?.click();
            toast.error("Enter valid name!")
            return
        }
        startTransition(() => {
            updateUserField({ name: name })
                .then(() => {
                    toast.success("Profile updated");
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Something went wrong"))
        })
    }

    const onUpdate = (url: string) => {
        if (!url) {
            toast.error('Something went wrong!')
            return;
        }
        startTransition(() => {
            updateUserField({ image: url })
                .then(() => {
                    toast.success("Profile updated!");
                    setImage(url);
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Something went wrong"))
        })
    }

    return (
        <div className="rounded-md bg-muted p-4 w-[calc(100vw-58px)] md:w-full overflow-x-hidden">
        <form  className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
                <p className="text-sm font-medium">Name</p>
                <Input
                    placeholder="User input"
                    required
                    disabled={isPending}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength={3}
                    className="resize-none rounded-md border-zinc-300 dark:border-white/20 bg-muted"
                />
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium">
                    Image
                </p>
                {image ? (
                    <div className="relative md:max-w-xs aspect-video rounded-xl overflow-hidden border border-white/10">
                        <div className="absolute top-2 right-2 z-[10]">
                            <TooltipComponent label="Remove thumbnail"  position="left">
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
                            src={image}
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
            <div className="flex justify-between">
                <DialogClose ref={closeRef} asChild>
                    <Button type="button" variant="ghost" className="hover:bg-background">
                        Close
                    </Button>
                </DialogClose>
                <Button
                    disabled={isPending}
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