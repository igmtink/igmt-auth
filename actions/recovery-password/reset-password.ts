'use server'

import * as z from 'zod'

import { resetPasswordSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { generatePasswordResetToken } from '@/lib/token'
import { sendPasswordResetEmail } from '@/lib/resend'

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  const validatedFields = resetPasswordSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid email!' }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  //! Check if that user is not exist on our database or like it could mean that the user changed their email in the meantime somehow
  if (!existingUser) {
    return { error: 'Email not found!' }
  }

  //! First we will (generatePasswordToken) this will create a new token in our database
  const passwordResetToken = await generatePasswordResetToken(email)

  //! Second we will pass the (email) & (token) to send the email to the user
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  return { success: 'Reset password email sent!' }
}
