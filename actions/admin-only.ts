'use server'

import { currentUserRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'

//! (ROLE GATE) inside of (SERVER ACTION)
export const adminOnly = async () => {
  const userRole = await currentUserRole()
  if (userRole !== UserRole.ADMIN) {
    return { error: 'Forbidden the user on Server Action!' }
  }

  return { success: 'Allowed the user on Server Action!' }
}
