"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member",
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined
    }[]
}

export const ServerSearch = ({
    data
}: ServerSearchProps) => {

    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {

        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(!open)
            }
        }

        document.addEventListener('keydown', down);
        return (() => document.removeEventListener('keydown', down))

    }, []);

    const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
        setOpen(false);

        if (type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        }

        if (type === "channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
        }
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant='ghost'
                size='lg'
                className="flex items-center gap-x-2 w-full text-zinc-500 dark:text-zinc-400"
            >
                <Search className="w-4 h-4" />
                <p className="font-medium text-sm">Search</p>
                <kbd
                    className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
                >
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}  >
                <CommandInput placeholder="Search all channels and members" />
                <CommandList className="dark:bg-dark1 px-2 md:p-0" >
                    <CommandEmpty>
                        No Results found
                    </CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;

                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, icon, name }) => {
                                    return (
                                        <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export const ServerSearchSkeleton = () => {
    return(
        <div className="w-full px-4 py-3 flex justify-between items-center">
            <Skeleton className="w-full h-6 rounded-md" />
        </div>
    )
}