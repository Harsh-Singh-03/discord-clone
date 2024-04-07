"use client"

import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import React, { FormEvent, useEffect, useRef, useState, useTransition } from "react"
import { isValidName } from "@/lib/utils"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { createCategoryInServer, deleteCategory, updateCategory } from "@/actions/category"

interface CategoryProps {
    children: React.ReactNode,
    serverId: string,
    isEdit?: boolean,
    cat?: {
        id: string,
        title: string
    },
}

export const CreateCategory = ({ children, serverId, cat, isEdit }: CategoryProps) => {
    const [title, setTitle] = useState("")
    const [isPending, startTransition] = useTransition()
    const closeRef = useRef<HTMLButtonElement>(null)
    const path = usePathname()

    useEffect(() => {
        if (isEdit === true && cat && cat.title) {
            setTitle(cat.title)
        }
    }, [isEdit, cat])

    const onCreate = () => {
        startTransition(() => {
            createCategoryInServer(title, serverId, path || '')
                .then((data) => {
                    if (data.success) {
                        toast.success(data.message)
                        setTitle('')
                        closeRef.current?.click()
                    } else {
                        toast.error(data.message)
                    }
                }).catch(() => toast.error("Something went wrong"))
        })
    }

    const onUpdate = () => {
        if(!cat?.id) {
            toast.error("Invalid category") 
            return
        }
        startTransition(() => {
            updateCategory(serverId, cat.id, title)
                .then((data) => {
                    if (data.success) {
                        toast.success(data.message)
                        setTitle('')
                        closeRef.current?.click()
                    } else {
                        toast.error(data.message)
                    }
                }).catch(() => toast.error("Something went wrong"))
        })
    }

    const onDelete = () => {
        if(!cat || !cat.id || !serverId) {
            toast.error("Invalid category") 
            return
        }

        startTransition(() => {
            deleteCategory(cat.id, serverId)
                .then((data) => {
                    if (data.success) {
                        toast.success(data.message)
                        setTitle('')
                        closeRef.current?.click()
                    } else {
                        toast.error(data.message)
                    }
                }).catch(() => toast.error("Something went wrong"))
        })
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!isValidName(title)) {
            toast.error('Invalid field!')
            return
        }

        if (isEdit === true) {
            onUpdate()
        } else {
            onCreate()
        }


    }

    const t = isEdit === true ? 'Update' : 'Create'
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 text-black bg-white overflow-hidden">
                <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        {t} Category
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {t} category to organize your channels in the server
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
                        <Label className="font-medium" >Category title:</Label>
                        <Input className="bg-zinc-300/50 border-0 site-input text-black focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Enter category title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} />
                    </div>
                    <DialogFooter className="bg-gray-200 p-4 md:p-6">
                        {isEdit === true && (
                            <Button variant='destructive' size='sm' type="button" onClick={onDelete} disabled={isPending}>Delete</Button>
                        )}
                        <Button variant='primary' type="submit" size='sm' disabled={isPending}>{t}</Button>
                    </DialogFooter>
                </form>
                <DialogClose className="hidden">
                    <Button ref={closeRef} className="hidden">Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}