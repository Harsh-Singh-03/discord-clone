"use client"
import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { isEmail } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { resetPassRequest } from '@/actions/user'
import { Button } from '../../../components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const Reqpass = () => {

    const [isLoad, setIsLoad] = useState(false)
    const [email, setEmail] = useState('')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!isEmail(email)) {
            toast.error('Please enter a valid email')
            return;
        }
        try {
            setIsLoad(true)
            const res = await resetPassRequest(email)
            if (res && res.success) {
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        } catch (error: any) {
            toast.error("Server error please try again letter!")
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <div className='auth-form flex flex-col gap-4 lg:gap-6'>
            <h4 className='text-xl font-bold text-center'>Reset password request</h4>
            <form className='grid w-full gap-4' onSubmit={(e) => handleSubmit(e)}>
                <Input  type="email" name="email" value={email} placeholder='example@gmail.com' onChange={handleChange} required />
                <Button type='submit' className='gap' variant='default' size='sm' disabled={isLoad}>
                    {isLoad && (
                        <Loader2 className='w-5 h-5 animate-spin' />
                    )}
                    {isLoad ? "" : 'Submit Request'}
                </Button>
            </form>
            <p className=' text-center text-sm'>Don&apos;t have an account? 
                <Button asChild variant='link' size='sm' className='text-secondary-foreground h-auto' >
                    <Link href='/sign-up'>Create Account?</Link>
                </Button>
            </p>
        </div>

    )
}

export default Reqpass