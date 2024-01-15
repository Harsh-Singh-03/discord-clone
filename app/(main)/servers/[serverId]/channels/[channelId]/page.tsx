import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessageSender } from "@/components/chat/chat-message-sender"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ConferenceRoom } from "@/components/globals/conference-room"
import { Separator } from "@/components/ui/separator"
import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"

interface props {
  params: {
    channelId: string,
    serverId: string
  }
}
const page = async ({ params }: props) => {

  const res = await fetchUser()
  if (!res || !res.success || !res.user) redirect('/sign-in')

  const channelData = await db.channel.findUnique({
    where: { id: params.channelId, serverId: params.serverId }
  })

  const memberData = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: res.user.id
    }
  })

  if (!channelData || !memberData) redirect(`/`)

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full relative">
      <ChatHeader
        name={channelData.name}
        serverId={channelData.serverId}
        type="channel"
      />
      <Separator className="h-0.5 rounded-md mt-12" />
      {channelData.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={memberData}
            name={channelData.name}
            chatId={channelData.id}
            type="channel"
            socketUrl="/api/socket/message"
            socketQuery={{
              channelId: channelData.id,
              serverId: channelData.serverId,
              userId: res.user.id
            }}
            paramKey="channelId"
            paramValue={channelData.id}
          />
          <ChatMessageSender
            name={channelData.name}
            type="channel"
            apiUrl='/api/socket/message'
            query={{
              channelId: channelData.id,
              serverId: channelData.serverId,
              userId: res.user.id
            }} />
        </>
      )}
      {channelData.type === ChannelType.VIDEO && (
        <ConferenceRoom
          audio={true}
          chatId={channelData.id}
          video={true}
          route={`/servers/${params.serverId}`}
        />
      )}
      {channelData.type === ChannelType.AUDIO && (
        <ConferenceRoom
          audio={true}
          chatId={channelData.id}
          video={false}
          route={`/servers/${params.serverId}`}
        />
      )}
    </div>
  )
}

export default page