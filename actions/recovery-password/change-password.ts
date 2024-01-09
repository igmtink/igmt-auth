'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { changePasswordSchema } from '@/schemas'
import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { prismadb as db } from '@/lib/prismadb'

export const changePassword = async (
  values: z.infer<typeof changePasswordSchema>,
  token: string | null
) => {
  if (!token) return { error: 'Missing token!' }

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) return { error: 'Invalid token!' }

  //! Check if the (existingToken) is expired by checking the (existingToken.expires) if less than to date now (new Date())
  const tokenIsExpired = new Date(existingToken.expires) < new Date()

  if (tokenIsExpired) return { error: 'Token has expired!' }

  const existingUser = await getUserByEmail(existingToken.email)

  //! Check if that user is not exist on our database like it could mean that the user changed their email in the meantime somehow
  if (!existingUser) return { error: 'Email does not exist!' }

  const validatedFields = changePasswordSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid fields!' }

  const { newPassword } = validatedFields.data

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  //! Update the user password to new (hashedPassword)
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  })

  return { success: 'Password updated!' }
}
