

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Airplay, Settings2 } from "lucide-react"
import { GeneralTab } from "./general-tav"
import { ChannelTab } from "./channels-tab"
import { Server } from "@prisma/client"

interface settingsProps{
    server: Server
}

export const Tab = ({server}: settingsProps) => {

    return (
        <Tabs defaultValue="general" className="w-full">
            
            <TabsList className="grid w-full grid-cols-2">

                <TabsTrigger value="general" className="items-center gap-1 md:gap-2 text-sm">
                    <Settings2 className="w-4 h-4" />
                    general
                </TabsTrigger>

                <TabsTrigger value="channels" className="items-center gap-1 md:gap-2 text-sm">
                    <Airplay className="w-4 h-4"  />
                    Channels
                </TabsTrigger>
                
            </TabsList>

            <TabsContent value="general">
                <GeneralTab server={server} />
            </TabsContent>

            <TabsContent value="channels">
                <ChannelTab />
            </TabsContent>
        </Tabs>
    )
}