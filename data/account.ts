import { prismadb as db } from '@/lib/prismadb'

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = db.account.findFirst({
      where: { userId }
    })

    return account
  } catch (error) {
    return null
  }
}
