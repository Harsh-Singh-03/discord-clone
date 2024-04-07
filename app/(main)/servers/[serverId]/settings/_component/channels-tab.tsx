
"use client"

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ChannelSettings } from "./channel-settings";
import { Edit2, GripIcon } from "lucide-react";
import { CreateCategory } from "@/components/dialogs/create-category";
import { useAppContext } from "@/components/context";
import { cn, reorder } from "@/lib/utils";
import { toast } from "sonner";
import { updateCategoryOrder } from "@/actions/category";
import { updateChannelOrder } from "@/actions/channel";
import { useState } from "react";

export const ChannelTab = ({ id }: { id: string }) => {
    const { sideBarData, setSideBarData } = useAppContext()
    const [isDrag, setIsDrag] = useState(false)

    const onEnd = async (result: any) => {
        const { destination, source, type } = result;
        
        if (!destination) { return; }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        setIsDrag(true)

        if (type === 'category') {
            const items = reorder(
                sideBarData,
                source.index,
                destination.index,
            ).map((item, index) => ({ ...item, order: index + 1 }));
            setSideBarData(items);
            try {
                const data = await updateCategoryOrder(items)
                if (data?.success === true) toast.success(data?.message);
                if (!data?.success) toast.warning(data?.message)
            } catch (error) {
                toast.error("Internal error")
            } finally{
                setIsDrag(false)
            }
        }
        // api for uodate TODO
        if (type === 'channel') {
            let newSideBarData = [...sideBarData];
            // Source and destination list
            const sourceList = newSideBarData.find(cat => cat.id === source.droppableId);
            const destList = newSideBarData.find(cat => cat.id === destination.droppableId);

            if (!sourceList || !destList) return
            // Check if cards exists on the sourceList
            if (!sourceList.channels) sourceList.channels = [];
            // Check if cards exists on the destList
            if (!destList.channels) destList.channels = [];
            // Moving the card in the same list
            if (source.droppableId === destination.droppableId) {
                
                const reorderd_channels = reorder(
                    sourceList.channels,
                    source.index,
                    destination.index,
                );
                reorderd_channels.forEach((channel, idx) => {
                    channel.order = idx + 1;
                });
                sourceList.channels = reorderd_channels;
                setSideBarData(newSideBarData);
                try {
                    const data = await updateChannelOrder(reorderd_channels)
                    if (data?.success === true) toast.success(data?.message);
                    if (!data?.success) toast.warning(data?.message)
                } catch (error) {
                    toast.error("internal error")
                } finally {
                    setIsDrag(false)
                }
                // api for update by TODO
            } else {
                const [movedCard] = sourceList.channels.splice(source.index, 1);
                // Assign the new listId to the moved card
                movedCard.categoryId = destination.droppableId;
                // Add card to the destination list
                destList.channels.splice(destination.index, 0, movedCard);

                sourceList.channels.forEach((cnl, idx) => {
                  cnl.order = idx + 1;
                });

                // Update the order for each card in the destination list
                destList.channels.forEach((cnl, idx) => {
                  cnl.order = idx + 1;
                });

                setSideBarData(newSideBarData);
                try {
                    const data = await updateChannelOrder(destList.channels)
                    if (data?.success === true) toast.success(data?.message);
                    if (!data?.success) toast.warning(data?.message)
                } catch (error) {
                    toast.error("internal error")
                } finally{
                    setIsDrag(false)
                }
            }
        }

        setIsDrag(false)
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
                <DragDropContext onDragEnd={onEnd} >
                    <Droppable droppableId="categories" type="category" direction="vertical">
                        {(provided) => (
                            <div className="w-full h-auto grid gap-4 md:gap-6"
                                {...provided.droppableProps}
                                ref={provided.innerRef}  >
                                {sideBarData.map((item, index) => {
                                    return (
                                        <Draggable draggableId={item.id} index={index} key={item.id} isDragDisabled={isDrag} >
                                            {(provided) => (
                                                <div key={index} className="w-auto"
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}>
                                                    <div {...provided.dragHandleProps}>
                                                        <div className={cn(
                                                            "px-3 py-4 bg-white dark:bg-zinc-600/80 rounded-md w-full flex items-center justify-between",
                                                            isDrag && 'opacity-30'
                                                        )}>
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
                                                        <ChannelSettings data={item.channels} id={item.id} serverId={id} disable={isDrag} />
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