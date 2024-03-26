import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='flex-1 w-full grid place-items-center h-full'>
        <Loader2 className='w-8 h-8 animate-spin'/>
    </div>
  )
}

export default loading