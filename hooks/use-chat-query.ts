import { useInfiniteQuery } from '@tanstack/react-query'
import { useSocket } from '@/components/provider/socket-provider'
import { getChannelMessages } from '@/actions/messages'

interface chatQueryProps {
    channelId: string,
    paramKey: string,
    queryKey: string
}

export const useChatQuery = ({ channelId, paramKey, queryKey }: chatQueryProps) => {
    const { isConnected } = useSocket()

    const fetchMessages = async ({ pageParam = undefined }) => {
        const res = await getChannelMessages(channelId, pageParam)
        return res
    }
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };
}