import NextAuth, { User, type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

// import Google from 'next-auth/providers/google'

import { UserRole } from '@prisma/client'
import authConfig from '@/auth.config'
import { prismadb as db } from '@/lib/prismadb'
import { getUserById } from '@/data/user'
import { get2FAConfirmationByUserId } from '@/data/2fa/2fa-confirmation'
import { getAccountByUserId } from '@/data/account'

//! To extend the types of (next-auth)
// declare module 'next-auth' {
//   interface Session {
//     user: {
//       role: UserRole
//     } & DefaultSession['user'] // To keep the default types
//   }
// }

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update
} = NextAuth({
  // providers: [Google]
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  events: {
    //! Using events (linkAccount) you can create a logic / function whenever new user logged in or signup using (OAuth Provider)
    async linkAccount({ user }) {
      //! I simply update the (emailVerified) for the new user to add a date, because we restricted the user if they're not verified they're email
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    //! This callback (signIn) will be in process after the validation on (login) server action
    async signIn({ user, account }) {
      //! Allowed (OAuth Provider) without (Email Verification)
      if (account?.provider !== 'credentials') return true

      const existingUser = await getUserById(user.id)

      //! Prevent sign in without (Email Verification)
      if (!existingUser?.emailVerified) return false

      //! Check if the user is enabled the (2FA)
      if (existingUser.is2FAEnabled) {
        const twoFactorAuthenticationConfirmation =
          await get2FAConfirmationByUserId(existingUser.id)

        //! If there's no (twoFactorConfirmation) prevent to logging in the user
        if (!twoFactorAuthenticationConfirmation) return false

        //! After the user sign in delete the (Two Factor Confirmation) for next sign in
        await db.twoFactorAuthenticationConfirmation.delete({
          where: { id: twoFactorAuthenticationConfirmation.id }
        })
      }

      return true
    },
    async session({ token, session }) {
      //! To extend and update the (session) from (token)
      if (session.user) {
        session.user.name = token.name
        session.user.id = token.sub as string
        session.user.username = token.username as string
        session.user.email = token.email
        session.user.role = token.role as UserRole
        session.user.is2FAEnabled = token.is2FAEnabled as boolean
        session.user.isOAuth = token.isOAuth as boolean
      }

      // if (token.sub && session.user) {
      //   session.user.id = token.sub
      // }

      // if (token.username && session.user) {
      //   session.user.username = token.username as string
      // }

      // if (token.role && session.user) {
      //   session.user.role = token.role as UserRole
      // }

      // if (session.user) {
      //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      // }

      // if (session.user) {
      //   session.user.email = token.email
      // }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token
      }

      //! Using (getUserById) query instead of (getUserByUsername or getUserByEmail) because (id) is a primary key so the query is going to be much faster
      const existingUser = await getUserById(token.sub)

      if (!existingUser) {
        return token
      }

      const existingAccount = await getAccountByUserId(existingUser.id)

      //! To extend and update the (session)

      token.name = existingUser.name

      token.username = existingUser.username

      token.email = existingUser.email

      token.role = existingUser.role

      token.is2FAEnabled = existingUser.is2FAEnabled

      //! Using (!!) is to convert to a (boolean), if the (existingUser) have a linked (existingAccount) then convert the (existingAccount) to boolean
      token.isOAuth = !!existingAccount

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  //! Using separate (auth.config) so it will be compatible in edge
  ...authConfig
})
