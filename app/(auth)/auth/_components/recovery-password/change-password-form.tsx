'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { changePasswordSchema } from '@/schemas'
import {
  FormError,
  FormSuccess
} from '../../../../../components/auth/form-status'
import { changePassword } from '@/actions/recovery-password/change-password'

import { BeatLoader } from 'react-spinners'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export const ChangePasswordForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    setError('')
    setSuccess('')

    //! Using (useTransition) react hook to have a transition / pending also it will revalidate the page automatically
    startTransition(() => {
      //! The (data) argument is coming from our (return) in (change-password) server action, because in server action there's our validation logic
      changePassword(values, token).then(data => {
        setError(data?.error)
        setSuccess(data?.success)
      })
    })
  }

  return (
    <Card
      title='Set up a new password'
      description='Your password must be different from your previous one.'
      className='max-w-md text-left'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mb-2 flex flex-col gap-4'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='New Password'
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmNewPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Confirm New Password'
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Creating this Form Status is to show to the user if there's an error or success in the back-end like there's no user in the database, and also if they're bypassing the client side validation */}
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button size='sm' type='submit' disabled={isPending}>
            {!isPending ? (
              'Update Password'
            ) : (
              <BeatLoader size='6' color='#ffffff' />
            )}
          </Button>
        </form>
      </Form>

      <Link href='/login' className='text-center text-sm'>
        Back to login
      </Link>
    </Card>
  )
}
