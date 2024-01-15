import { updateUserEmailVerification } from "@/actions/user"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const page = async ({ params }: { params: { id: string, token: string } }) => {
    const res = await updateUserEmailVerification(params.id, params.token)
    if (!res || res.success === false) notFound()

    return (
        <div className="w-screen h-screen grid place-items-center">
            {res && res.success && (
                <div className="w-full h-full relative grid place-items-center">
                     <Image src='/auth-bg.svg' alt="background" width={0} height={0} className="fixed bottom-0 left-0 w-full h-screen object-cover z-0" />
                     <div className="auth-form flex flex-col items-center justify-center gap-4 lg:gap-6">
                        <CheckCircle className="w-14 h-14 text-green-600" />
                        <h4 className="text-center text-lg font-semibold">Email verified!!</h4>
                        <Button asChild variant='primary' className="px-8">
                            <Link href='/'>Home</Link>
                        </Button>
                     </div>
                </div>
            )}
        </div>
    )
}

export default page