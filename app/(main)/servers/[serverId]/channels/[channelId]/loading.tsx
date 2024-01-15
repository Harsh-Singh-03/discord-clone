import { ChatHeaderSkeleton } from '@/components/chat/chat-header'
import { ChatBottomSkeleton } from '@/components/chat/chat-message-sender'
import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeaderSkeleton />
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
      <ChatBottomSkeleton />
    </div>
  )
}

export default loading