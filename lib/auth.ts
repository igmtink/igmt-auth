//! THIS (LIB) CAN USE IN ANYWHERE THAT (SERVER SIDE) LIKE (API, SERVER COMPONENT, SERVER ACTION)

import { auth } from '@/auth'

//! Reusable (session) for (server side)
export const currentUser = async () => {
  const session = await auth()

  return session?.user
}

//! Reusable (Current User Role) for (server side)
export const currentUserRole = async () => {
  const session = await auth()

  return session?.user.role
}
