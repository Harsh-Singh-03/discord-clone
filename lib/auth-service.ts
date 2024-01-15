import { getServerSession } from "next-auth"
import { db } from "./db"

export const fetchUser = async () => {
    try {
        const session = await getServerSession()
        if (!session || !session.user || !session.user.email) return { success: false, message: "invalid request, session expired please relogin" }
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: {id: true, image: true, name: true, email: true, username: true, isEmailVerified: true, bio: true, provider: true}
        })
        if (!user) { return { success: false, message: "session expired please relogin" } }
        else { return { user, success: true } }

    } catch (error: any) {
        return { success: false, message: 'Something went wrong!' }
    }
}