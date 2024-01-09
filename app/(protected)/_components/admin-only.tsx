'use client'

import { toast } from 'sonner'

import { UserRole } from '@prisma/client'
import { adminOnly } from '@/actions/admin-only'

import { FormSuccess } from '@/components/auth/form-status'
import { RoleGate } from '@/components/auth/role-gate'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const AdminOnly = () => {
  const onApiRoutClick = () => {
    fetch('/api/admin').then(response => {
      if (response.ok) {
        toast.success('Allowed the user on API Route!')
      } else {
        toast.error('Forbidden the user on API Route!')
      }
    })
  }

  const onServerActionClick = () => {
    adminOnly().then(data => {
      if (data.error) {
        toast.error(data.error)
      }

      if (data.success) {
        toast.success(data.success)
      }
    })
  }

  return (
    <Card title='🔑 Admin Component' className='w-[672px]'>
      <RoleGate allowedRole={UserRole.ADMIN}>
        <FormSuccess message='You are allowed to see this content!' />
      </RoleGate>

      <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2 shadow-md'>
        <p className='text-sm font-medium'>Admin-only API Route</p>
        <Button size='sm' onClick={onApiRoutClick}>
          Click to test
        </Button>
      </div>

      <div className='flex items-center justify-between rounded-sm bg-card-secondary px-3 py-2 shadow-md'>
        <p className='text-sm font-medium'>Admin-only Server Action</p>
        <Button size='sm' onClick={onServerActionClick}>
          Click to test
        </Button>
      </div>
    </Card>
  )
}
