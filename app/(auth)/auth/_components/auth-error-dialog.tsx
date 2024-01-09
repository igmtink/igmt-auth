import Link from 'next/link'

import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Card } from '@/components/ui/card'

export const AuthErrorDialog = () => {
  return (
    <Card description='Oops! Something went wrong!' className='max-w-md'>
      <div className='mb-2 flex items-center justify-center'>
        <ExclamationTriangleIcon className='text-destructive' />
      </div>

      <Link href='/login' className='text-center text-sm'>
        Back to login
      </Link>
    </Card>
  )
}
