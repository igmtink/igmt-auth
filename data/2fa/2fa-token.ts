import { prismadb as db } from '@/lib/prismadb'

export const get2FATokenByToken = async (token: string) => {
  try {
    const twoFactorAuthenticationToken = await db.twoFactorAuthenticationToken.findUnique({
      where: { token }
    })

    return twoFactorAuthenticationToken
  } catch (error) {
    return null
  }
}

export const get2FATokenByEmail = async (email: string) => {
  try {
    const twoFactorAuthenticationToken = await db.twoFactorAuthenticationToken.findFirst({
      where: { email }
    })

    return twoFactorAuthenticationToken
  } catch (error) {
    return null
  }
}
