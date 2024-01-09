import { prismadb as db } from '@/lib/prismadb'

export const get2FAConfirmationByUserId = async (userId: string) => {
  try {
    //! We don't need use (email) here because (TwoFactorConfirmation) model have a relation in (User) model
    const twoFactorAuthenticationConfirmation =
      await db.twoFactorAuthenticationConfirmation.findUnique({
        where: {
          userId
        }
      })

    return twoFactorAuthenticationConfirmation
  } catch (error) {
    return null
  }
}
