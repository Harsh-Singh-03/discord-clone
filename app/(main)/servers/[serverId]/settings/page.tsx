import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface props {
    params: {
      serverId: string
    }
}
const page = async ({params}: props) => {
    const res = await fetchUser()
    if(!res || !res.user || !res.success) redirect(`/servers/${params.serverId}`)

    const serverData = await db.server.findUnique({
        where: {id: params.serverId, userId: res.user.id}
    })
    if(!serverData || serverData.userId !== res.user.id) redirect(`/servers/${params.serverId}`)

    return (
        <p>settings</p>
    )
}

export default page