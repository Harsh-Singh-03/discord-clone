import { ServerCrash } from "lucide-react"

export const Empty = () => {
    return (
        <div className=" hidden md:flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-12 w-12 text-zinc-500 my-4" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
               Its Empty here select any channel
            </p>
        </div>
    )
}