"use client"

import { signIn } from 'next-auth/react'
import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isEmail, isValidName, isValidPassword, isValidUsername } from '@/lib/utils'
import axios from "axios"
import { Info, Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const SignUp = () => {
  const router = useRouter()
  const [isLoad, setIsLoad] = useState(false)
  const [Credential, setCredential] = useState({ email: '', username: "", password: "", name: "" })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredential({ ...Credential, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isEmail(Credential.email)) {
      toast.error('Please enter a valid email.')
      return;
    }
    if (!isValidName(Credential.name)) {
      toast.error('Name should contain min 3 charcter.')
      return;
    }
    if (!isValidPassword(Credential.password)) {
      toast.error('Invalid password.')
      return;
    }
    if (!isValidUsername(Credential.username)) {
      toast.error('Invalid username.')
      return;
    }
    try {
      setIsLoad(true)
      const { data } = await axios.post('/api/auth/create-account', Credential)
      if (data.success === true) {
        toast.success('Account created successfully !!')
        const res = await signIn("Credentials", {
          redirect: false,
          email: Credential.email,
          password: Credential.password
        })
        if (res?.ok) {
          router.replace('/')
        } else {
          router.replace('/sign-in')
        }
      } else {
        toast.error(data.message || 'Something went wrong')
      }
    } catch (error: any) {
      toast.error('Something went wrong')
    } finally {
      setIsLoad(false)
    }
  }

  return (
    <div className='auth-form flex flex-col gap-4 lg:gap-6'>
      <h4 className='text-xl font-bold text-center'>Welcome, Create Account</h4>
      <form className='grid w-full gap-4' onSubmit={handleSubmit}>
        <Input type="text" name="name" value={Credential.name} placeholder='name..' onChange={handleChange} required minLength={3} />
        <div>
          <Input type="text" name="username" value={Credential.username} placeholder='username..' onChange={handleChange} required minLength={5} maxLength={30} />
          <div className="flex items-center gap-2 text-muted-foreground ml-2 mt-2">
            <Info className='w-4 h-4' />
            <p className='text-[10px]'>Allowed: ( _ , _ ) , lowercase and 5-30 charcter range</p>
          </div>
        </div>
        <Input type="email" name="email" value={Credential.email} placeholder='example@gmail.com' onChange={handleChange} required />
        <div>
          <Input type="password" value={Credential.password} name="password" placeholder='password...' onChange={handleChange} required minLength={8} />
          <div className="flex items-center gap-2 text-muted-foreground ml-2 mt-2">
            <Info className='w-4 h-4' />
            <p className='text-[10px]'>Contain: 1 unique charcter, 1 lowercase, 1 uppercase and 8-30 charcter range</p>
          </div>
        </div>
        <Button variant='default' type='submit' className='gap-2' disabled={isLoad}>
          {isLoad ? (
            <Loader2 className='w-5 h-5 animate-spin' />
          ) :
            <>
              <UserPlus className='w-5 h-5' />
              Create Account
            </>
          }
        </Button>
      </form>
      <p className='text-center text-sm'>Alread have an account?
        <Button asChild variant='link' size='sm' className='text-secondary-foreground h-auto' >
          <Link href='/sign-in'>Login?</Link>
        </Button>
      </p>
    </div>

  )
}

export default SignUp
