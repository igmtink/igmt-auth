'use server'

import * as z from 'zod'

import { prismadb as db } from '@/lib/prismadb'
import { settingsSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'

export const settingsUpdate = async (
  values: z.infer<typeof settingsSchema>
) => {
  const user = await currentUser()

  if (!user) return { error: 'Unauthorized' }

  //! Check if the user logged in using (OAuth Provider)
  if (user.isOAuth) {
    //! These are the fields that (OAuth) users cannot modify because their email is handled by the provider and they don't have a password and also 2fa is handled by the provider
    values.email = undefined
    values.oldPassword = undefined
    values.newPassword = undefined
    values.is2FAEnabled = undefined
  }

  await db.user.update({
    where: {
      id: user?.id
    },
    data: {
      ...values
    }
  })

  return { success: 'Settings updated!' }
}
