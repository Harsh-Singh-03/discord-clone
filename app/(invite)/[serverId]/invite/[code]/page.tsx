import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"


const page = async ({ params }: { params: { serverId: string, code: string } }) => {

    const res = await fetchUser()
    if (!res || !res.success || !res.user) redirect('/sign-in')

    const data = await db.server.findFirst({
        where: {
            id: params.serverId, inviteCode: params.code, members: {
                some: {
                    userId: res.user.id
                }
            }
        }
    })
    if (data) redirect(`/servers/${params.serverId}`)

    const server = await db.server.update({
        where: {
            id: params.serverId,
            inviteCode: params.code
        },
        data: {
            members: {
                create: [
                    {
                        userId: res.user.id
                    }
                ]
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null
}
export default page