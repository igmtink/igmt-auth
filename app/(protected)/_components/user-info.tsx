import React from 'react'

import { ExtendedUser } from '@/next-auth'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TUserInfo {
  user?: ExtendedUser
  label: string
}

export const UserInfo: React.FC<TUserInfo> = ({ user, label }) => {
  return (
    <Card title={label} className='w-[672px]'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2'>
          <p className='text-sm font-medium'>ID</p>

          <Badge variant='secondary'>{user?.id}</Badge>
        </div>

        <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2'>
          <p className='text-sm font-medium'>Name</p>

          <Badge variant='secondary'>{user?.name}</Badge>
        </div>

        <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2'>
          <p className='text-sm font-medium'>Username</p>

          <Badge variant='secondary'>{user?.username}</Badge>
        </div>

        <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2'>
          <p className='text-sm font-medium'>Email</p>

          <Badge variant='secondary'>{user?.email}</Badge>
        </div>

        <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2'>
          <p className='text-sm font-medium'>Role</p>

          <Badge variant='secondary'>{user?.role}</Badge>
        </div>

        <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2'>
          <p className='text-sm font-medium'>Two Factor Authentication</p>

          <Badge variant={user?.is2FAEnabled ? 'success' : 'destructive'}>
            {user?.is2FAEnabled ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
