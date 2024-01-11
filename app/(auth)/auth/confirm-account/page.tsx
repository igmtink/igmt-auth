// import { ClientConfirmAccountForm } from '@/app/(auth)/auth/_components/client-confirm-account-form'

// export default function ConfirmAccount() {
//   return <ClientConfirmAccountForm />
// }

import Link from 'next/link'

import { BeatLoader } from 'react-spinners'

import { confirmAccount } from '@/actions/confirm-account'
import { FormError, FormSuccess } from '@/components/auth/form-status'
import { Card } from '@/components/ui/card'

export default async function ConfirmAccount({
  searchParams
}: {
  searchParams: { token: string }
}) {
  const result = await confirmAccount(searchParams.token)
  return (
    <Card
      title='Account Confirmation'
      description='Confirm your verification'
      className='max-w-md'
    >
      <div className='mb-2 flex w-full items-center justify-center'>
        {!result.error && !result.success && (
          <BeatLoader size='6' color='#ffffff' />
        )}
        <FormError message={result.error} />
        <FormSuccess message={result.success} />
      </div>

      <Link href='/login' className='text-center text-sm'>
        Back to login
      </Link>
    </Card>
  )
}
