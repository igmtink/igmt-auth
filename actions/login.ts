'use server'

import { AuthError } from 'next-auth'
import * as z from 'zod'
// import bcrypt from 'bcryptjs'

import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { logInSchema } from '@/schemas'
import { generateEmailVerificationToken, generate2FAToken } from '@/lib/token'
import { getUserByUsername } from '@/data/user'
import { sendEmailVerificationEmail, sendTwoFactorEmail } from '@/lib/resend'
import { get2FATokenByToken } from '@/data/2fa/2fa-token'
import { prismadb as db } from '@/lib/prismadb'
import { get2FAConfirmationByUserId } from '@/data/2fa/2fa-confirmation'

export const login = async (values: z.infer<typeof logInSchema>) => {
  const validatedFields = logInSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid fields!' }

  const { username, password, twoFactorAuthenticationCode } =
    validatedFields.data

  const existingUser = await getUserByUsername(username)

  if (
    !existingUser ||
    !existingUser.username ||
    !existingUser.email ||
    !existingUser.password
  ) {
    return { error: 'Incorrect username or password!' }
  }

  // const passwordMatch = await bcrypt.compare(password, existingUser.password)
  const passwordMatch = await Bun.password.verify(
    password,
    existingUser.password
  )

  if (!passwordMatch) return { error: 'Incorrect username or password!' }

  //! Check if the (existingUser) is doesn't have (Email Verification)
  if (!existingUser.emailVerified) {
    //! First we will (generateEmailVerificationToken) this will create a new token in our database
    const emailVerificationToken = await generateEmailVerificationToken(
      existingUser.email
    )

    //! Second we will pass the (email) & (token) to send the email to the user
    await sendEmailVerificationEmail(
      emailVerificationToken.email,
      emailVerificationToken.token
    )

    return { success: 'Confirmation email sent!' }
  }

  //! Check if the user is enabled the (2FA) then send a (twoFactorToken) email
  if (existingUser.is2FAEnabled) {
    if (twoFactorAuthenticationCode) {
      // if (!twoFactorCode) return { error: 'Missing code!' }

      const existingTwoFactorToken = await get2FATokenByToken(
        twoFactorAuthenticationCode
      )

      if (!existingTwoFactorToken) return { error: 'Invalid code!' }

      // if (existingTwoFactorToken.token !== twoFactorCode) {
      //   return { error: 'Invalid code!' }
      // }

      const tokenIsExpired =
        new Date(existingTwoFactorToken.expires) < new Date()

      //! Check if the (existingToken) is expired by checking the (existingToken.expires) if less than to date now (new Date())
      if (tokenIsExpired) return { error: 'Code expired!' }

      //! After successfully verify the (twoFactorToken) we will delete it on the database
      await db.twoFactorAuthenticationToken.delete({
        where: { id: existingTwoFactorToken.id }
      })

      const existing2FAConfirmation = await get2FAConfirmationByUserId(
        existingUser.id
      )

      //! Check if there's a (existingTwoFactorConfirmation) then delete it on the database
      if (existing2FAConfirmation) {
        await db.twoFactorAuthenticationConfirmation.delete({
          where: { id: existing2FAConfirmation.id }
        })
      }

      //! After deleted the (existingTwoFactorConfirmation) we create a new one
      await db.twoFactorAuthenticationConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      const twoFactorAuthenticationToken = await generate2FAToken(
        existingUser.email
      )
      await sendTwoFactorEmail(
        twoFactorAuthenticationToken.email,
        twoFactorAuthenticationToken.token
      )

      return { '2FA': true }
    }
  }

  //! After all validation logic we will validate the other authentication logic inside of (signIn callback) in (auth)
  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    //! If there's an error inside of (Credentials Provider) like there's no user existing on the database
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Incorrect username or password!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }

    throw error
  }
}
