import { CreateServer } from "@/components/dialogs/create-server"
import { ModeToggle } from "@/components/globals/toggle-mode"
import { Button } from "@/components/ui/button"
import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {

  const res = await fetchUser()

  let serverId: string | undefined;
  if (res && res.user && res.success) {
    const data = await db.server.findFirst({
      where: {
        members: {
          some: {
            userId: res.user.id
          }
        }
      }
    })
    serverId = data?.id
  }

  return (
    <div className='relative w-screen h-[100svh] flex flex-col'>
      <Image src='/home-bg.svg' alt="Banner" fill className="object-cover z-[-1]" />

      <div className="flex justify-between items-center h-14 bg-muted/50 w-full px-4 md:px-6 z-10">
        <h1 className="font-bold text-2xl md:text-3xl flex-1 ">Hangouts</h1>
        <ModeToggle />
      </div>

      <div className="w-full flex justify-center items-center flex-1 p-4 z-10">

        <div className="bg-white/20 text-white rounded-md p-4 md:p-6 w-full lg:w-1/2 space-y-4">
          <h1 className="font-bold text-xl md:text-3xl text-center">Welcome to the Hangouts</h1>
          <p className="text-center text-sm md:text-base">Personlize your own server or join other, Invite your friends make rooms channels etc. for your best Hangouts</p>

          {!res.success && !res.user && (
            <div className="flex gap-x-3 items-center py-4">
              <Button asChild variant="primary" className="flex-1 text-xs md:text-sm">
                <Link href='sign-up'>
                  Create your account
                </Link>
              </Button>
              <Button variant="ghost" asChild className="flex-1 hover:bg-white/30 border border-white/40 text-xs md:text-sm">
                <Link href='sign-in'>
                  Login
                </Link>
              </Button>
            </div>
          )}

          <div className="flex gap-x-3 items-center py-4">
            {serverId && (
              <>
                <Button asChild variant="primary" className="flex-1 text-xs md:text-sm">
                  <Link href={`/servers/${serverId}`}>
                    Access your servers
                  </Link>
                </Button>
              </>
            )}
            {res && res.success && res.user && (
              <CreateServer>
                <Button variant="ghost" className="flex-1 hover:bg-white/30 border border-white/40 text-xs md:text-sm">
                  Create your server
                </Button>
              </CreateServer>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
