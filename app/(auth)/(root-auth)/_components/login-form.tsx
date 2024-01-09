'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { logInSchema } from '@/schemas'
import { FormError, FormSuccess } from '../../../../components/auth/form-status'
import { login } from '@/actions/login'

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
import { Separator } from '@/components/ui/separator'
import { SocialLogin } from '@/app/(auth)/(root-auth)/_components/social-login'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// const formSchema = z
//   .object({
//     userInput: z.string().nonempty({
//       message: 'Please enter a username or email.'
//     })
//   })
//   .refine(
//     data => {
//       const isEmail = z.string().email().safeParse(data.userInput).success
//       const isUsername = z.string().min(2).safeParse(data.userInput).success
//       return isEmail || isUsername
//     },
//     { message: 'Please enter a valid username or email.' }
//   )

export const LogInForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isShow2FA, setIsShow2FA] = useState(false)

  //! To get the (error) params that provided by next-auth if something a problem like logging in with same email in different (OAuth Provider)
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''

  const form = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      username: '',
      password: '',
      twoFactorAuthenticationCode: ''
    }
  })

  const onSubmit = (values: z.infer<typeof logInSchema>) => {
    setError('')
    setSuccess('')

    //! Using (useTransition) react hook to have a transition / pending also it will revalidate the page automatically
    startTransition(() => {
      //! The (data) argument is coming from our (return) in (login) server action, because in server action there's our validation logic
      login(values)
        .then(data => {
          // setError(data?.error)
          // // TODO: Add when we add 2FA
          // setSuccess(data?.success)

          if (data?.error) {
            form.reset()
            setError(data.error)
          }

          if (data?.success) {
            form.reset()
            setSuccess(data.success)
          }

          if (data?.['2FA']) {
            setIsShow2FA(true)
          }
        })
        .catch(() => setError('Something went wrong!'))
    })
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-8 px-4 pb-20 pt-40 sm-h:pt-12',
        {
          'h-dvh justify-center gap-0 py-0 sm-h:pt-0': isShow2FA
        }
      )}
    >
      {!isShow2FA && (
        <div>
          <h1 className='text-2xl'>Welcome back.</h1>
        </div>
      )}

      <Card
        title={!isShow2FA ? 'Log In' : 'Two Factor Authentication'}
        description={
          !isShow2FA
            ? 'Please enter your information to log in.'
            : 'A verification code has been sent to your email. This code will be valid for 5 minutes.'
        }
        className='max-w-md'
      >
        {!isShow2FA && <SocialLogin />}

        {!isShow2FA && (
          <div className='flex items-center justify-center gap-4 text-muted-foreground'>
            <Separator className='shrink' /> or <Separator className='shrink' />
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='space-y-4'>
              {isShow2FA && (
                <FormField
                  control={form.control}
                  name='twoFactorAuthenticationCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='123456'
                          {...field}
                          // className='text-center'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!isShow2FA && (
                <>
                  <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder='Username'
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
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Password'
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {!isShow2FA && (
              <Link
                className='self-end text-sm text-primary hover:underline hover:underline-offset-4'
                href='/auth/reset-password'
              >
                Forgot your password?
              </Link>
            )}

            {/* Creating this Form Status is to show to the user if there's an error or success in the back-end like there's no user in the database, and also if they're bypassing the client side validation */}
            <FormError message={error || urlError} />
            <FormSuccess message={success} />

            {isShow2FA ? (
              <Button
                size='sm'
                type='submit'
                disabled={isPending}
                className='mb-2'
              >
                {!isPending ? (
                  'Verify'
                ) : (
                  <BeatLoader size='6' color='#ffffff' />
                )}
              </Button>
            ) : (
              <Button
                size='sm'
                type='submit'
                disabled={isPending}
                className='mb-2'
              >
                {!isPending ? (
                  'Log In'
                ) : (
                  <BeatLoader size='6' color='#ffffff' />
                )}
              </Button>
            )}

            {!isShow2FA && (
              <div className='text-center text-sm text-muted-foreground'>
                Just getting started? &nbsp;
                <Link
                  className='text-primary hover:underline hover:underline-offset-4'
                  href='/signup'
                >
                  Create an Account
                </Link>
              </div>
            )}
          </form>
        </Form>

        {isShow2FA && (
          <Link href='/login' className='text-center text-sm'>
            Back to login
          </Link>
        )}
      </Card>
    </div>
  )
}
