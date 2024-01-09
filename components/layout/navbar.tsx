'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { UserButton } from '@/components/auth/user-button'

export const NavBar = () => {
  const pathname = usePathname()
  return (
    <header className='w-[672px] rounded-md bg-card p-4 shadow-md'>
      <div className='flex items-center justify-between'>
        <nav className='flex gap-4'>
          <Button
            size='sm'
            asChild
            variant={pathname === '/client' ? 'default' : 'ghost'}
          >
            <Link href='/client'>Client</Link>
          </Button>

          <Button
            size='sm'
            asChild
            variant={pathname === '/server' ? 'default' : 'ghost'}
          >
            <Link href='/server'>Server</Link>
          </Button>

          <Button
            size='sm'
            asChild
            variant={pathname === '/admin' ? 'default' : 'ghost'}
          >
            <Link href='/admin'>Admin</Link>
          </Button>

          <Button
            size='sm'
            asChild
            variant={pathname === '/settings' ? 'default' : 'ghost'}
          >
            <Link href='/settings'>Settings</Link>
          </Button>
        </nav>

        <UserButton />
      </div>
    </header>
  )
}
