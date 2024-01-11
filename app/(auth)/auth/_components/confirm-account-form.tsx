'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { confirmAccount } from '@/actions/confirm-account'

import { BeatLoader } from 'react-spinners'

import { Card } from '@/components/ui/card'
import { FormError, FormSuccess } from '@/components/auth/form-status'

export const ConfirmAccountForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    confirmAccount(token)
      .then(data => {
        setError(data.error)
        setSuccess(data.success)
      })
      .catch(() => {
        setError('Something went wrong!')
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <Card
      title='Account Confirmation'
      description='Confirm your verification'
      className='max-w-md'
    >
      <div className='mb-2 flex w-full items-center justify-center'>
        {!success && !error && <BeatLoader size='6' color='#ffffff' />}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>

      <Link href='/login' className='text-center text-sm'>
        Back to login
      </Link>
    </Card>
  )
}
