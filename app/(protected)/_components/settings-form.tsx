'use client'

import { useState, useTransition } from 'react'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { BeatLoader } from 'react-spinners'
import { UserRole } from '@prisma/client'
import { useSession } from 'next-auth/react'

import { settingsSchema } from '@/schemas'
import { settingsUpdate } from '@/actions/settings-update'
import { useCurrentUser } from '@/hooks/use-current-user'

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
import { FormError, FormSuccess } from '@/components/auth/form-status'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export const SettingsForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const user = useCurrentUser()

  const { update } = useSession()

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      //! Use (undefined) instead of (empty string) so it will not add this (name) value on the (settingsUpdate) server action because we spread the all values there
      name: user?.name || undefined,
      username: user?.username || undefined,
      email: user?.email || undefined,
      //! The default value is (undefined) because we don't have the user's password, we only have the (hashedPassword), so if the user save the settings we are not going to update the password
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      is2FAEnabled: user?.is2FAEnabled || undefined
    }
  })

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      settingsUpdate(values)
        .then(data => {
          if (data.error) {
            setError(data.error)
          }

          if (data.success) {
            //! To update the (session) whenever have changes in the (settings)
            update()
            setSuccess(data.success)
          }
        })
        .catch(() => setError('Something went wrong!'))
    })
  }

  return (
    <Card title='⚙️ Settings'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder='Name' disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {user?.isOAuth === false && (
            <>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Username'
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
                        {...field}
                        placeholder='Email'
                        type='email'
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
                        {...field}
                        placeholder='Old Password'
                        type='password'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='New Password'
                        type='password'
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger aria-label='User Role Button'>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {user?.isOAuth === false && (
            <FormField
              control={form.control}
              name='is2FAEnabled'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-md bg-card-secondary px-3 py-2 shadow-md'>
                  <div className='space-y-0.5'>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label='2FA Switch'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            size='sm'
            type='submit'
            disabled={isPending}
            className='self-end'
          >
            {isPending ? <BeatLoader size='6' color='#ffffff' /> : 'Save'}
          </Button>
        </form>
      </Form>
    </Card>
  )
}
