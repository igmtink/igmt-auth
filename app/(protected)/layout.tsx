import React from 'react'

import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { NavBar } from '@/components/layout/navbar'

export default async function ProtectedRouteLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    //! To use (session) in (client side)
    <SessionProvider session={session}>
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex flex-col gap-12'>
          <NavBar />
          <main className='w-full'>{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}
