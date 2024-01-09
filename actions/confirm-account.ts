'use server'

import { prismadb as db } from '@/lib/prismadb'
import { getUserByEmail } from '@/data/user'
import { getEmailVerificationTokenByToken } from '@/data/email-verification-token'

export const confirmAccount = async (token: string | null) => {
  if (!token) return { error: 'Missing token!' }

  const existingEmailVerificationToken =
    await getEmailVerificationTokenByToken(token)

  if (!existingEmailVerificationToken) return { error: 'Invalid token!' }

  //! Check if the (existingToken) is expired by checking the (existingToken.expires) if less than to date now (new Date())
  const tokenIsExpired =
    new Date(existingEmailVerificationToken.expires) < new Date()

  if (tokenIsExpired) return { error: 'Token has expired!' }

  const existingUser = await getUserByEmail(
    existingEmailVerificationToken.email
  )

  //! Check if that user is not exist on our database like it could mean that the user changed their email in the meantime somehow
  if (!existingUser) return { error: 'Email does not exist!' }

  //! Update that (existingUser) to add a date on (emailVerified)
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      //! Use (existingToken.email) instead of using (existingUser.email) because we're going to reuse this (new-verification) server action for whenever user wants to modify their email in the (settings) page, we are not going to immediately update their email in the database we are going to create a token with that new email and send an email to that email then when they confirm it we are going to update the email inside of the database
      email: existingEmailVerificationToken.email
    }
  })

  //! After we update the (emailVerified) of (existingUser) we can now delete the (verificationToken)
  await db.emailVerificationToken.delete({
    where: { id: existingEmailVerificationToken.id }
  })

  return { success: 'Email verified!' }
}
