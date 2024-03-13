import Login from "../_components/Login"
import { redirect } from "next/navigation"
import Image from "next/image"
import { fetchUser } from "@/lib/auth-service"

const page = async () => {
  
  const sesson = await fetchUser()
  if(sesson && sesson.user && sesson.success) redirect('/')

  return (
    <div className="w-full min-h-screen grid place-items-center relative">
         <Image src='/auth-bg.svg' alt="background" width={0} height={0} className="fixed bottom-0 left-0 w-full h-screen object-cover z-0" />
      <Login />
    </div>
  )
}

export default page
