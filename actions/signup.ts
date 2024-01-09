'use server'

import { signUpSchema } from '@/schemas'
import * as z from 'zod'
import bcrypt from 'bcryptjs'
// import argon2 from 'argon2'

import { prismadb as db } from '@/lib/prismadb'
import { getUserByEmail, getUserByUsername } from '@/data/user'
import { generateEmailVerificationToken } from '@/lib/token'
import { sendEmailVerificationEmail } from '@/lib/resend'

export const signup = async (values: z.infer<typeof signUpSchema>) => {
  const validatedFields = signUpSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid fields!' }

  const { firstName, lastName, username, email, password } =
    validatedFields.data

  const existingUsername = await getUserByUsername(username)

  if (existingUsername) return { error: 'Username is already in use!' }

  const existingEmail = await getUserByEmail(email)

  if (existingEmail) return { error: 'Email is already in use!' }

  const hashedPassword = await bcrypt.hash(password, 12)
  // const hashedPassword = await Bun.password.hash(password)
  // const hashedPassword = await argon2.hash(password)

  await db.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      username,
      email,
      password: hashedPassword
    }
  })

  //! First we will (generateEmailVerificationToken) this will create a new token in our database
  const emailVerificationToken = await generateEmailVerificationToken(email)

  //! Second we will pass the (email) & (token) to send the email to the user
  await sendEmailVerificationEmail(
    emailVerificationToken.email,
    emailVerificationToken.token
  )

  return { success: 'Confirmation email sent!' }
}
