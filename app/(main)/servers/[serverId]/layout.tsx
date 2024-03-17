import type { Metadata } from 'next'
import '@/app/globals.css'
import { Fragment, Suspense } from 'react'
import { ServerSideBar, ServerSideBarSkeleton } from '@/components/globals/server-side-bar'
import { fetchUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { MemberProvider } from '@/components/context/member-context'

export const metadata: Metadata = {
    title: 'Servers | Discord',
    description: 'Generated by create next app',
}

export default async function RootLayout({
    children, params
}: {
    children: React.ReactNode,
    params: { serverId: string }
}) {

    const res = await fetchUser();
    if (!res || !res.success || !res.user) redirect('/')

    const data = await db.server.findFirst({
        where: {
            id: params.serverId,
            members: {
                some: {
                    userId: res.user.id
                }
            }
        }
    })

    if (!data) redirect('/')

    return (
        <Fragment>

            <Suspense fallback={<ServerSideBarSkeleton />}>
                <ServerSideBar serverId={data.id} userId={res.user.id} />
            </Suspense>

            <section className='flex-1'>
                {children}
            </section>

        </Fragment>


    )
}
