'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { FormError, FormSuccess } from '@/components/auth/form-status'
import { resetPasswordSchema } from '@/schemas'
import { resetPassword } from '@/actions/recovery-password/reset-password'

import { BeatLoader } from 'react-spinners'

import { Card } from '@/components/ui/card'
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

export const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    setError('')
    setSuccess('')

    //! Using (useTransition) react hook to have a transition / pending also it will revalidate the page automatically
    startTransition(() => {
      //! The (data) argument is coming from our (return) in (reset-password) server action, because in server action there's our validation logic
      resetPassword(values).then(data => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
  }

  return (
    <Card
      title='Reset Password'
      description='Enter your email address and we will send you password reset instructions.'
      className='max-w-md text-left'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mb-2 flex flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Email' {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Creating this Form Status is to show to the user if there's an error or success in the back-end like there's no user in the database, and also if they're bypassing the client side validation */}
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button size='sm' type='submit' disabled={isPending}>
            {!isPending ? (
              'Send reset instructions'
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
