"use client"

import { signIn } from 'next-auth/react'
import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isEmail, isValidPassword } from '@/lib/utils'
import { Loader2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const Login = () => {
    const router = useRouter()
    const [isLoad, setIsLoad] = useState(false)

    const [Credential, setCredential] = useState({ email: '', password: "" })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredential({ ...Credential, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!isEmail(Credential.email)) {
            toast.error("Please enter a valid email.")
            return;
        }
        if (!isValidPassword(Credential.password)) {
            toast.error("Password should be 8 charcter long.")
            return;
        }
        try {
            setIsLoad(true)
            const res = await signIn("Credentials", {
                redirect: false,
                email: Credential.email,
                password: Credential.password
            })
            if (res?.ok) {
                toast.success("Successfully login !!")
                router.replace('/')
            } else {
                toast.error(res?.error || 'Something went wrong!')
            }
        } catch (error: any) {
            toast.error("Something went wrong!")
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <div className='auth-form flex flex-col gap-4 lg:gap-6 z-10'>
            <h4 className='text-xl font-bold text-center'>Welcome, Sign In</h4>
            <form className='grid w-full gap-4' onSubmit={(e) => handleSubmit(e)}>
                <Input type="email" name="email" value={Credential.email} placeholder='example@gmail.com' onChange={handleChange} required />
                <Input type="password" value={Credential.password} name="password" placeholder='password...' onChange={handleChange} required minLength={8} />
                <Button variant='primary' type='submit' className='gap-2' disabled={isLoad}>
                    {isLoad ? (
                        <Loader2 className='w-5 h-5 animate-spin' />
                    ) : <LogIn className='w-5 h-5' />}
                    {isLoad ? "" : 'SIGN IN'}
                </Button>
            </form>
            <div className='flex justify-end'>
                <Button asChild variant='link' size='sm' className='text-secondary-foreground h-auto' >
                    <Link href='/reset-password-request'>Forget password?</Link>
                </Button>
            </div>
            <p className='text-center text-sm'>Don&apos;t have an account? 
                <Button asChild variant='link' size='sm' className='text-secondary-foreground h-auto' >
                    <Link href='/sign-up'>Create Account?</Link>
                </Button>
            </p>
        </div>

    )
}

export default Login