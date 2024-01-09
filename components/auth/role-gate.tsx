'use client'

import React from 'react'
import { FormError } from '@/components/auth/form-status'
import { useCurrentUserRole } from '@/hooks/user-current-role'

export const RoleGate: React.FC<TRoleGate> = ({ children, allowedRole }) => {
  const userRole = useCurrentUserRole()
  if (userRole !== allowedRole)
    return (
      <FormError message='You do not have permission to view this content!' />
    )

  return <>{children}</>
}
