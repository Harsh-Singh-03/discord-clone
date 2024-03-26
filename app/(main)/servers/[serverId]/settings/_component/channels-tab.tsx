
"use client"

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState, useTransition } from "react";
import { ChannelSettings } from "./channel-settings";
import { Edit2, GripIcon, GripVertical, Loader2 } from "lucide-react";
import { getServerSettings, getServerdata } from "@/actions/server";
import { toast } from "sonner";
import { Category, Channel, Server } from "@prisma/client";

interface dataProp {
    channels: Channel[],
    id: string;
    title: string;
    userId: string;
    serverId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const ChannelTab = ({ id }: { id: string }) => {

    const [isPending, setIsPending] = useState(true)

    const [data, setData] = useState<dataProp[] | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getServerSettings(id)
                if (res.success) {
                    if(res.server && !!res.server.Category && res.server.Category.length > 0) {
                        setData(res.server.Category)
                    }
                } else {
                    toast.error('Some error occurred')
                }
            } catch (error) {
                toast.error('Something went wrong')
            } finally {
                setIsPending(false)
            }
        }
        getData()
    }, [])

    const onEnd = () => {

    }

    if (isPending) {
        return (
            <div className="w-full grid place-items-center h-36">
                <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 grid md:gap-6">
            {/* Header */}
            <div className="flex justify-between flex-col md:flex-row gap-4">
                <h2 className="text-xl font-semibold tracking-wide flex-1">Channels Settings :-</h2>
                <div className="flex items-center justify-end gap-4">
                    {/* Create channel & category */}

                </div>
            </div>

            {!isPending && (!data || data.length === 0) && (
                <p className="text-sm my-6 text-center text-muted-foreground">Categories & channels not found</p>
            )}
            {/* Draggble list */}
            {!isPending && data && data.length > 0 && (
                <DragDropContext onDragEnd={onEnd}>
                    <Droppable droppableId="lists" type="list" direction="vertical">
                        {(provided) => (
                            <div className="w-full h-auto grid gap-4 md:gap-6"
                                {...provided.droppableProps}
                                ref={provided.innerRef}  >
                                {data.map((item, index) => {
                                    return (
                                        <Draggable draggableId={item.id} index={index} key={item.id}>
                                            {(provided) => (
                                                <div key={index} className="w-auto"
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}>
                                                    <div {...provided.dragHandleProps}>
                                                        <div className="px-3 py-4 bg-white dark:bg-zinc-600/80 rounded-md w-full flex items-center justify-between">
                                                            <div className="flex gap-2 items-center">
                                                                <GripIcon className="w-5 h-5" />
                                                                <p className="text-base m-0 font-medium">{item.title}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button>
                                                                    <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary mr-2" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <ChannelSettings data={item.channels} id={item.id} />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

        </div>
    )
}