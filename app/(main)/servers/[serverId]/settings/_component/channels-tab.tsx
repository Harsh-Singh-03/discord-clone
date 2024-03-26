
"use client"

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import { ChannelSettings } from "./channel-settings";
import { Edit2, GripVertical } from "lucide-react";

export const ChannelTab = () => {

    const dumArr = [{ data: [{ id: 4 }, { id: 5 }, { id: 6 }], id: 1 }, { data: [{ id: 7 }, { id: 8 }, { id: 9 }], id: 2 }]

    const [data, setData] = useState(dumArr);

    const onEnd = () => {

    }

    return (
        <div className="p-4 md:p-6 grid md:gap-6">
            {/* Header */}
            <div className="flex justify-between flex-col md:flex-row gap-4">
                <h2 className="text-xl font-semibold tracking-wide flex-1">Channel Settings :-</h2>
                <div className="flex items-center justify-end gap-4">
                    {/* Create channel & category */}
                </div>
            </div>
            {/* Draggble list */}
            <DragDropContext onDragEnd={onEnd}>
                <Droppable droppableId="lists" type="list" direction="vertical">
                    {(provided) => (
                        <div className="w-full h-auto grid gap-4 md:gap-6"
                            {...provided.droppableProps}
                            ref={provided.innerRef}  >
                            {data.map((item, index) => {
                                return (
                                    <Draggable draggableId={item.id.toString()} index={index} key={item.id}>
                                        {(provided) => (
                                            <div key={index} className="w-auto"
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}>
                                                <div {...provided.dragHandleProps}>
                                                    <div className="px-3 py-4 bg-white dark:bg-zinc-600/80 rounded-md w-full flex items-center justify-between">
                                                        <p className="m-0 text-sm font-medium">Category {item.id}</p>
                                                        <div className="flex items-center gap-3">
                                                            <button>
                                                                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                            </button>
                                                            <button className="pointer-events-none">
                                                                <GripVertical className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <ChannelSettings data={item.data} id={item.id} />
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

        </div>
    )
}