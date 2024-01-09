//! THIS (LIB) CAN USE IN ANYWHERE THAT (SERVER SIDE) LIKE (API, SERVER COMPONENT, SERVER ACTION)

import { v4 as uuid4v } from 'uuid'
import crypto from 'crypto'

import { prismadb as db } from './prismadb'
import { getEmailVerificationTokenByEmail } from '@/data/email-verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { get2FATokenByEmail } from '@/data/2fa/2fa-token'

export const generateEmailVerificationToken = async (email: string) => {
  const token = uuid4v()

  //! It will expire on (1 hour)
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingEmailVerificationToken =
    await getEmailVerificationTokenByEmail(email)

  //! If there's a (existingToken) on that specific (email) we will delete it and generate a new one, example if the token is expired or the user will logging in but we sent already the (generateVerificationToken) on our (signup) server action, and on our (login) server action have a (generateVerificationToken) too so we delete the (existingToken)
  if (existingEmailVerificationToken) {
    await db.emailVerificationToken.delete({
      where: {
        id: existingEmailVerificationToken.id
      }
    })
  }

  const emailVerificationToken = await db.emailVerificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return emailVerificationToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid4v()

  //! It will expire on (1 hour)
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingPasswordResetToken = await getPasswordResetTokenByEmail(email)

  //! If there's a (existingToken) on that specific (email) we will delete it and generate a new one, example if the token is expired or the user will try to reset again their password but we sent already the (generatePasswordResetToken) on our (reset-password) server action so we delete the (existingToken)
  if (existingPasswordResetToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingPasswordResetToken.id
      }
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return passwordResetToken
}

export const generate2FAToken = async (email: string) => {
  //! Use (crypto) instead of (uuid) because in (Two Factor Authentication) we need a six digits number
  //! In javascript we can type (_) on the numbers to see how many zero we have, (100_000) is equal to (100000)
  const token = crypto.randomInt(100_00, 1_000_000).toString()

  //! It will expire on (5 minutes)
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

  const existing2FAToken = await get2FATokenByEmail(email)

  //! If there's a (existingToken) on that specific (email) we will delete it and generate a new one, example if the token is expired or the user will try to send (Two Factor Token) again
  if (existing2FAToken) {
    await db.twoFactorAuthenticationToken.delete({
      where: { id: existing2FAToken.id }
    })
  }

  const twoFactorAuthenticationToken =
    await db.twoFactorAuthenticationToken.create({
      data: { email, token, expires }
    })

  return twoFactorAuthenticationToken
}
