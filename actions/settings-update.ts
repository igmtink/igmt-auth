'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { prismadb as db } from '@/lib/prismadb'
import { settingsSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { getUserByEmail, getUserById } from '@/data/user'
import { generateEmailVerificationToken } from '@/lib/token'
import {
  sendChangedPasswordNotificationEmail,
  sendEmailVerificationEmail
} from '@/lib/resend'
import { update } from '@/auth'

export const settingsUpdate = async (
  values: z.infer<typeof settingsSchema>
) => {
  const user = await currentUser()

  if (!user) return { error: 'Unauthorized' }

  const databaseUser = await getUserById(user.id)

  if (!databaseUser) return { error: 'Unauthorized' }

  //! Check if the user logged in using (OAuth Provider)
  if (user.isOAuth) {
    //! These are the fields that (OAuth) users cannot modify because their email is handled by the provider and they don't have a password and also 2fa is handled by the provider
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.is2FAEnabled = undefined
  }

  //! Check if the (values.email) is not equal to the (user.email)
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    //! Check if the (values.email) is existed on the (database)
    if (existingUser && existingUser.id !== user.id)
      return { error: 'Email is already in use!' }

    //! First we will (generateEmailVerificationToken) this will create a new token in our database
    const emailVerificationToken = await generateEmailVerificationToken(
      values.email
    )

    //! Second we will pass the (email) & (token) to send the email to the user
    await sendEmailVerificationEmail(
      emailVerificationToken.email,
      emailVerificationToken.token
    )

    return { success: 'Confirmation email sent!' }
  }

  if (
    values.password &&
    values.newPassword &&
    databaseUser.password &&
    user.email
  ) {
    //! Compare the (values.password) to the (databaseUser.password) if they are match
    const passwordMatch = await bcrypt.compare(
      values.password,
      databaseUser.password
    )

    if (!passwordMatch) return { error: 'Incorrect old password!' }

    const hashedPassword = await bcrypt.hash(values.newPassword, 12)

    values.password = hashedPassword
    //! After all validation we will assign (undefined) to the (values.newPassword) because we don't have that in (database) we will just update the (old password) using (new password)
    values.newPassword = undefined

    await sendChangedPasswordNotificationEmail(user.email)
  }

  const updatedUser = await db.user.update({
    where: {
      id: user?.id
    },
    data: {
      ...values
    }
  })

  update({
    user: {
      name: updatedUser.name,
      username: updatedUser.username || undefined,
      email: updatedUser.email,
      role: updatedUser.role,
      is2FAEnabled: updatedUser.is2FAEnabled
    }
  })

  return { success: 'Settings updated!' }
}
