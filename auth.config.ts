import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
// import argon2 from 'argon2'

import { logInSchema } from '@/schemas'
import { getUserByUsername } from '@/data/user'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        //! We use (safeParse) to not throw an error on our web app, because or validation logic is on (login) server action
        const validatedFields = logInSchema.safeParse(credentials)

        //! (return null) is to provoke our validation logic on (login) server action
        if (validatedFields.success) {
          const { username, password } = validatedFields.data

          const user = await getUserByUsername(username)

          if (!user || !user.password) {
            return null
          }

          const passwordMatch = await bcrypt.compare(password, user.password)
          // const passwordMatch = await Bun.password.verify(
          //   password,
          //   user.password
          // )
          // const passwordMatch = await argon2.verify(password, user.password)

          if (passwordMatch) {
            return user
          }
        }

        return null
      }
    })
  ]
} satisfies NextAuthConfig
