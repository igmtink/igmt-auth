import { signout } from '@/actions/signout'
import { Button } from '../ui/button'

export const SignOutButton = ({ children }: { children: React.ReactNode }) => {
  return (
    // <form action={signout}>
    //   <Button type='submit' size='sm'>
    //     Logout
    //   </Button>
    // </form>
    <span onClick={() => signout()}>{children}</span>
  )
}
