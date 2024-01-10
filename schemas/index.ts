import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const logInSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  twoFactorAuthenticationCode: z.optional(z.string())
})

export const signUpSchema = z
  .object({
    firstName: z.string().min(2, { message: 'Firstname is required' }),
    lastName: z.string().min(2, { message: 'Lastname is required' }),
    username: z.string().min(2, { message: 'Username is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({
      message: 'Please enter a valid email'
    }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required' })
    // terms: z.literal(true, {
    //   errorMap: () => ({ message: 'You must accept Terms and Conditions' })
    // })
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match"
  })

export const resetPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({
    message: 'Please enter a valid email'
  })
})

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required' })
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: "Password don't match"
  })

export const settingsSchema = z
  .object({
    name: z.optional(z.string().min(2, { message: 'Name is required' })),
    username: z.optional(
      z.string().min(2, { message: 'Username is required' })
    ),
    email: z.optional(
      z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Please enter a valid email' })
    ),
    password: z.optional(
      z.string().min(6, { message: 'Password must be at least 6 characters' })
    ),
    newPassword: z.optional(
      z.string().min(6, { message: 'Password must be at least 6 characters' })
    ),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    is2FAEnabled: z.optional(z.boolean())
  })
  .refine(
    data => {
      //! If we have a (currentPassword) but we don't have the (newPassword)
      if (data.password && !data.newPassword) return false

      return true
    },
    {
      message: 'New password is required',
      path: ['newPassword']
    }
  )
  .refine(
    data => {
      //! If we have a (newPassword) but we don't have the (currentPassword)
      if (data.newPassword && !data.password) return false

      return true
    },
    {
      message: 'Current password is required',
      path: ['password']
    }
  )
