import { useSession } from 'next-auth/react'

//! Reusable (session) for (client side)
export const useCurrentUser = () => {
  const session = useSession()

  return session.data?.user
}
