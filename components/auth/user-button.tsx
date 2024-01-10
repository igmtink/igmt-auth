'use client'

import { PersonIcon, ExitIcon } from '@radix-ui/react-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SignOutButton } from '@/components/auth/signout-button'
import { useCurrentUser } from '@/hooks/use-current-user'

export const UserButton = () => {
  const user = useCurrentUser()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label='User Button'>
        <Avatar className='size-8'>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback className='bg-primary'>
            <PersonIcon className='size-3.5' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <SignOutButton>
          <DropdownMenuItem>
            <ExitIcon className='mr-2 size-3.5' /> Logout
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
