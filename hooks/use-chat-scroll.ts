import { useEffect, useState } from "react"

interface props{
    bottomRef: React.RefObject<HTMLDivElement>,
    chatRef: React.RefObject<HTMLDivElement>,
    shouldLoadMore: boolean,
    loadMore: () => void,
    count: number
}
export const useChatScroll = ({bottomRef, chatRef, shouldLoadMore, count, loadMore}: props) => {

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        const topDiv = chatRef?.current

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop
            if(scrollTop === 0 && shouldLoadMore){
                loadMore()
            }
        }

        topDiv?.addEventListener('scroll', handleScroll)

        return () => {
            topDiv?.removeEventListener("scroll", handleScroll);
        }

    }, [chatRef, shouldLoadMore, loadMore])

    useEffect(() => {
        const bottomDiv = bottomRef?.current
        const topDiv = chatRef?.current

        const shouldAutoScroll = () => {
            if(!hasInitialized && bottomDiv){
                setHasInitialized(true)
                return true
            }

            if(!topDiv){
                return false
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollHeight - topDiv.clientHeight
            return distanceFromBottom <= 100
        }

        if(shouldAutoScroll()){
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: 'smooth'
                })
            }, 200)
        }

    },[bottomRef, chatRef, hasInitialized, count])

}   