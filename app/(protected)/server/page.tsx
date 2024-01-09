import { currentUser } from '@/lib/auth'

import { UserInfo } from '@/app/(protected)/_components/user-info'

export default async function Server() {
  const user = await currentUser()
  return <UserInfo user={user} label='💻 Server Component' />
}
