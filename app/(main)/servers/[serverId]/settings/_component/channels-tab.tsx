
"use client"

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ChannelSettings } from "./channel-settings";
import { Edit2, GripIcon } from "lucide-react";
import { CreateCategory } from "@/components/dialogs/create-category";
import { useAppContext } from "@/components/context";

export const ChannelTab = ({ id }: { id: string }) => {

    const { sideBarData } = useAppContext()

    const onEnd = () => {

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

            {(!sideBarData || sideBarData.length === 0) && (
                <p className="text-sm my-6 text-center text-muted-foreground">Categories & channels not found</p>
            )}
            {/* Draggble list */}
            {!!sideBarData && sideBarData.length > 0 && (
                <DragDropContext onDragEnd={onEnd}>
                    <Droppable droppableId="lists" type="list" direction="vertical">
                        {(provided) => (
                            <div className="w-full h-auto grid gap-4 md:gap-6"
                                {...provided.droppableProps}
                                ref={provided.innerRef}  >
                                {sideBarData.map((item, index) => {
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
                                                                <CreateCategory serverId={id} isEdit={true} cat={{ id: item.id, title: item.title }}>
                                                                    <button>
                                                                        <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary mr-2" />
                                                                    </button>
                                                                </CreateCategory>
                                                            </div>
                                                        </div>
                                                        <ChannelSettings data={item.channels} id={item.id} serverId={id} />
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