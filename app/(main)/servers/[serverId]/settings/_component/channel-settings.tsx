"use client"

import { Draggable, Droppable } from "@hello-pangea/dnd"
import { Edit, GripVertical } from "lucide-react"

interface props {
    data: {
        id: number
    }[],
    id: number
}
export const ChannelSettings = ({ data, id }: props) => {

    return (
        <Droppable droppableId={id.toString()} type="card">
            {(provided1) => (
                <div ref={provided1.innerRef} {...provided1.droppableProps} className="grid ml-2 md:ml-4 gap-2 md:gap-4 mt-2 md:mt-4">
                    {data.map((item, index) => {
                        return (
                            <Draggable draggableId={item.id.toString()} index={index} key={item.id}>
                                {(provided2) => (
                                    <div {...provided2.draggableProps} {...provided2.dragHandleProps} ref={provided2.innerRef}>
                                        <div className="p-3 bg-zinc-50 dark:bg-zinc-600/40 rounded-md w-full flex items-center justify-between">
                                            <p className="m-0 text-sm font-medium">Channel {item.id}</p>
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