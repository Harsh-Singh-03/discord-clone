"use client"

import { Draggable, Droppable } from "@hello-pangea/dnd"
import { Channel, ChannelType } from "@prisma/client"
import { Edit, GanttChart, GripVertical, Hash, Mic, Video } from "lucide-react"

interface props {
    data: Channel[],
    id: string
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}

export const ChannelSettings = ({ data, id }: props) => {

    return (
        <Droppable droppableId={id.toString()} type="card">
            {(provided1) => (
                <div ref={provided1.innerRef} {...provided1.droppableProps} className="grid ml-2 md:ml-4 gap-2 mt-2">
                    {data.map((item, index) => {
                         const Icon = iconMap[item.type];
                        return (
                            <Draggable draggableId={item.id.toString()} index={index} key={item.id}>
                                {(provided2) => (
                                    <div {...provided2.draggableProps} {...provided2.dragHandleProps} ref={provided2.innerRef}>
                                        <div className="p-3 bg-zinc-50 dark:bg-zinc-600/40 rounded-md w-full flex items-center justify-between">
                                            <div className="flex gap-2 items-center">
                                                <Icon className="w-4 h-4" />
                                                <p className="text-sm m-0 font-medium">{item.name}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button>
                                                    <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </button>
                                                <button>
                                                    <GripVertical className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        )
                    })}
                    {provided1.placeholder}
                </div>
            )}
        </Droppable>
    )
}