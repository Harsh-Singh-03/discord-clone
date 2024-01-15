"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  route: string
};

export const ConferenceRoom = ({
  chatId,
  video,
  audio,
  route
}: MediaRoomProps) => {

  const session = useSession()
  const router = useRouter()
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!session.data?.user?.name) return;
    const name = session.data?.user?.name;

    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        // console.log(e);
      }
    })()
  }, [session.data?.user?.name, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2
          className="h-7 w-7 text-zinc-500 animate-spin my-4"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-scroll">
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVE_KIT_SOCKET_URL!}
        token={token}
        connect={true}
        video={video}
        onDisconnected={() => router.push(route)}
        audio={audio}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  )
}