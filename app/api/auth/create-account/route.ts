import { db } from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { isEmail, isValidName, isValidPassword, isValidUsername } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

interface RequestBody {
    email: string;
    password: string;
    name: string;
    username: string
}

export async function POST(req: NextRequest) {
    try {
        const { email, username, password, name }: RequestBody = await req.json()
        if (!isEmail(email)) {
          return NextResponse.json({ success: false, status: 400, message: "Invaild email" })
        }
        if(!isValidName(name)){
          return NextResponse.json({ success: false, status: 400, message: "Invaild name" })
        }
        if (!isValidPassword(password)) {
          return NextResponse.json({ success: false, status: 400, message: "Invaild password" })
        }
        if (!isValidUsername(username)) {
          return NextResponse.json({ success: false, status: 400, message: "Invaild username" })
        }
        const user = await db.user.findUnique({
            where: {
                email,
            },
        })
        if (user) {
            return NextResponse.json({ success: false, status: 400, message: "Email already registred" })
        } 
        const checkUsername = await db.user.findUnique({
            where: {
                username,
            },
        })
        if(checkUsername) return NextResponse.json({ success: false, status: 400, message: "username already taken, try different!" })
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(password, salt);
        await db.user.create({
            data:
            {
                name,
                email,
                username,
                password: securePass,
                provider: 'credential'
            }
        })
        revalidatePath('/')
        return NextResponse.json({ success: true, message: "Account created", status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message, status: 500, success: false })
    }

}   