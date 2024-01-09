'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { signUpSchema } from '@/schemas'
import { signup } from '@/actions/signup'
import { FormError, FormSuccess } from '../../../../components/auth/form-status'

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

export const SignUpForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    setError('')
    setSuccess('')

    //! Using (useTransition) react hook to have a transition / pending also it will revalidate the page automatically
    startTransition(() => {
      //! The (data) argument is coming from our (return) in (signup) server action, because in server action there's our validation logic
      signup(values).then(data => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='First Name'
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
              name='lastName'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='Last Name'
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Email'
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

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm Password'
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Creating this Form Status is to show to the user if there's an error or success in the back-end, and also if they're bypassing the client side validation */}
        <FormError message={error} />
        <FormSuccess message={success} />

        <Button size='sm' type='submit' disabled={isPending} className='mb-2'>
          {!isPending ? 'Join' : <BeatLoader size='6' color='#ffffff' />}
        </Button>

        <div className='text-center text-sm text-muted-foreground'>
          Already have an Account? &nbsp;
          <Link
            className='text-primary hover:underline hover:underline-offset-4'
            href='/login'
          >
            Log In
          </Link>
        </div>
      </form>
    </Form>
  )
}
