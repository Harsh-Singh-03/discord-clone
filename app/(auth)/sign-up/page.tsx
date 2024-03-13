
import Image from "next/image"
import SignUp from "../_components/SignUp"
import { redirect } from "next/navigation"
import { fetchUser } from "@/lib/auth-service"

const page = async () => {
  const sesson = await fetchUser()
  if(sesson && sesson.user && sesson.success) redirect('/')
  return (
    <div className="min-h-screen w-full grid place-items-center relative px-4">
      <Image src='/auth-bg.svg' alt="background" width={0} height={0} className="fixed bottom-0 left-0 w-full h-screen object-cover z-0" />
      <SignUp />
    </div>
  )
}

export default page
