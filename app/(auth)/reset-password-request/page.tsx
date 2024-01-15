import Reqpass from "@/app/(auth)/_components/Reqpass"
import Image from "next/image"


const page = async () => {

    return (
        <div className="min-h-screen w-full grid place-items-center relative px-4">
            <Image src='/auth-bg.svg' alt="background" width={0} height={0} className="fixed bottom-0 left-0 w-full h-screen object-cover z-0" />
            <Reqpass />
        </div>
    )
}

export default page