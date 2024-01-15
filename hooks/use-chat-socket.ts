import { useSocket } from "@/components/provider/socket-provider"
import { MessageWithMemberWithProfile } from "@/lib/type"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

type chatKeyProps = {
    queryKey: string,
    addKey: string,
    updateKey: string
}

export const useChatSocket = ({ addKey, queryKey, updateKey }: chatKeyProps) => {
    const { socket } = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {

        if (!socket) {
            return
        }

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
              if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                return oldData;
              }
      
              const newData = oldData.pages.map((page: any) => {
                return {
                  ...page,
                  items: page.items.map((item: MessageWithMemberWithProfile) => {
                    if (item.id === message.id) {
                      return message;
                    }
                    return item;
                  })
                }
              });
      
              return {
                ...oldData,
                pages: newData,
              }
            })
        });

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (olddata: any) => {
                if (!olddata || !olddata.pages || olddata.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message]
                        }]
                    }
                }
                const newData = [...olddata.pages];
                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items,
                    ]
                };
                return {
                    ...olddata,
                    pages: newData
                }
            })
        })

        return () => {
            socket.off(addKey);
        }

    }, [addKey, queryClient, queryKey, socket])
}
