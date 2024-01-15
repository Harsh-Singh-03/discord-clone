import { CreateServer } from "@/components/dialogs/create-server"

export default async function Home() {
  
  return (
    <div className='flex'>
      <CreateServer >
        <button>Create</button>
      </CreateServer>
    </div>
  )
}
