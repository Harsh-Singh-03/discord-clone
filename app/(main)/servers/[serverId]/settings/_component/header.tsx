import { Back } from "@/components/globals/back"
import { Settings } from "lucide-react"

export const SettingHeader = ({serverName}: {serverName: string}) => {
    return (
        <div className="px-4 h-12 flex w-full items-center">
            <Back />
            <p className="text-sm md:text-base font-semibold">{serverName} Settings</p>
            <Settings className="w-4 h-4 md:w-5 md:h-5 ml-4" />

        </div>
    )
}