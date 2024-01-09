import { useSession } from 'next-auth/react'

//! Reusable (Current User Role) for (client side)
export const useCurrentUserRole = () => {
  const session = useSession()

  return session.data?.user.role
}
