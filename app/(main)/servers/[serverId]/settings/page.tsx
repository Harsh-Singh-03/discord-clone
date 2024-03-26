import { fetchUser } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Tab } from "./_component/tab"
import { SettingHeader } from "./_component/header"
import { Separator } from "@/components/ui/separator"

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
    if(!serverData) redirect('/')

    if(serverData.userId !== res.user.id) redirect(`/servers/${params.serverId}`)

    return (
        <div className="w-full bg-white dark:bg-[#313338] h-full overflow-scroll">
            <SettingHeader serverName={serverData.name} />

            <Separator />

            <div className="p-4 md:p-6">
                <Tab server={serverData} />
            </div>

        </div>
    )
}

export default page