"use server"

import { db } from "@/lib/db"
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/lib/mail"
import { isEmail, isValidPassword, isValidUsername } from "@/lib/utils"
import { User } from "@prisma/client"
import { fetchUser } from "@/lib/auth-service"
import { revalidatePath } from "next/cache"

// email verification request
export const verifyEmail = async (email: string) => {
    try {
        let user = await db.user.findUnique({ where: { email } })
        if (!user || user.isEmailVerified || user.provider !== 'credential') {
            return { success: false, message: "Inavild request" }
        }
        const token = crypto.randomBytes(32).toString("hex")
        await db.user.update({
            where: { email },
            data: { emailVerificationToken: token }
        })
        const url = `${process.env.NEXTAUTH_URL}/verify-email/${user.id}/${token}`
        let Text = `<h1>Hello ${user.name}</h1>
                    <p>Please verify your email</p>
                    <a href=${url} target="_blank">Click Here To Verify</a>`
        await sendEmail(user.email, "Email Verification", Text)
        return {
            success: true,
            message: "Verification email sent"
        }
    } catch (error) {
        return { success: false, message: "Server error try again later!" }
    }
}
// email verify
export const updateUserEmailVerification = async (id: string, token: string) => {
    try {
        const data = await db.user.update({
            where: { id, emailVerificationToken: token },
            data: { isEmailVerified: true }
        })
        if (!data) return { success: false, message: 'Invaild request!' }
        return { success: true, message: 'Email verified!!' }
    } catch (error) {
        return { success: false, message: "Server error try again later!" }
    }
}
// verifiy
export const resetPassRequest = async (email: string) => {
    try {
        let user = await db.user.findUnique({ where: { email } })
        if (!user || user.provider !== 'credential' ) {
            return { success: false, message: "Inavild request" }
        }
        const token = crypto.randomBytes(32).toString("hex")
        await db.user.update({
            where: { email },
            data: { resetPasswordToken: token }
        })
        const url = `${process.env.NEXTAUTH_URL}/reset-password/${user.id}/${token}`
        let Text = `<h1>Hello ${user.name}</h1>
                    <p>Here is your reset password url</p>
                    <a href=${url} target="_blank">Click Here To Reset Password</a>`
        await sendEmail(user.email, "Reset Password", Text)
        return {
            success: true,
            message: "Email Sent"
        }
    } catch (error) {
        return { success: false, message: "Server error try again later!" }
    }
}
// resetPass
export const resetPassUser =async (id: string, token: string, newPass: string) => {
    try {
        if(!isValidPassword(newPass)) return {success: false, message: 'Invalid password!'} 
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(newPass, salt);
        const data = await db.user.update({
            where: {id, resetPasswordToken: token},
            data: {password: securePass}
        })
        if(!data) return {success: false, message: 'Bad request!'}
        return {success: true, message: "Password updated successfully!"}
    } catch (error) {
        return {success: false, message: 'server error try agan later'}
    }
}
// Update User ( TODO )
export const updateUserField = async (values: Partial<User>) =>{
    try {
        const res = await fetchUser();
        if(!res || !res.success || !res.user) throw new Error('Session expired')
        const self = res.user

        const validData = {
            name: values.name,
            image: values.image,
            bio: values.bio,
        };

        const updatedUser = await db.user.update({
            where: {
                id: res.user.id,
            },
            data: {
                ...validData,
            },
        });

        revalidatePath(`/u/${self.username}/settings`);
        revalidatePath(`/u/${self.username}`);
        revalidatePath(`/${self.username}`);

        return updatedUser.username;
        
    } catch {
        throw new Error("Internal Error");
    };
}

export const updateUsernameById = async ( newUsername: string) => {
    if(!isValidUsername(newUsername)) throw new Error('Invalid username')
    const res = await fetchUser()
    if(!res || !res.success || !res.user ) throw new Error("Unauthorized")
    if(res.user.username === newUsername ) throw new Error("Username is same")
    const checkData = await db.user.findFirst({
        where: {username: newUsername}
    })
    if(checkData) throw new Error("Username already exist")
    const updata = await db.user.update({
        where: {id: res.user.id},
        data: {username: newUsername}
    })
    if(!updata) throw new Error("Something went wrong")
    return {success: true}
}

export const updateEmailOfUser = async (newEmail: string) => {
    if(!isEmail(newEmail)) throw new Error('Invalid email')
    const res = await fetchUser()
    if(!res || !res.success || !res.user ) throw new Error("Unauthorized")
    if(res.user.email === newEmail ) throw new Error("Email is same")
    const checkData = await db.user.findFirst({
        where: {email: newEmail}
    })
    if(checkData) throw new Error("Email already exist")
    const token = crypto.randomBytes(32).toString("hex")
    const updata = await db.user.update({
        where: {id: res.user.id},
        data: {
            email: newEmail,
            isEmailVerified: false,
            emailVerificationToken: token
        }
    })
    if(!updata) throw new Error("Something went wrong")
    const url = `${process.env.NEXTAUTH_URL}/verify-email/${res.user.id}/${token}`
    let Text = `<h1>Hello ${res.user.name}</h1>
                <p>Please verify your email</p>
                <a href=${url} target="_blank">Click Here To Verify</a>`
    await sendEmail(newEmail, "Email Verification", Text)
    return {success: true, message: 'Email updated & a verification mail sent, Please verify your email also.'}
}