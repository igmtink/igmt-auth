'use client'

import { UserInfo } from '@/app/(protected)/_components/user-info'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function Client() {
  const user = useCurrentUser()
  return <UserInfo user={user} label='💻 Client Component' />
}
