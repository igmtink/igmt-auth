import { UserRole } from '@prisma/client'

interface TCard {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

interface TFormStatus {
  message?: string
}

interface TEmailVerificationToken {
  token: string
}

interface TPasswordResetToken {
  token: string
}

interface TTwoFactorToken {
  token: string
}

interface TRoleGate {
  children: React.ReactNode
  allowedRole: UserRole
}
