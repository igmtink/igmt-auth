//! THIS (LIB) CAN USE IN ANYWHERE THAT (SERVER SIDE) LIKE (API, SERVER COMPONENT, SERVER ACTION)

import React from 'react'

import { Resend } from 'resend'

import { EmailVerificationEmail } from '@/components/emails/email-verification-email'
import { PasswordResetEmail } from '@/components/emails/password-reset-email'
import { TwoFactorAuthenticationEmail } from '@/components/emails/2fa-email'
import { ChangedPasswordNotificationEmail } from '@/components/emails/changed-password-notification-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmailVerificationEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    //! You can change this if you have a own domain
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your IGMT Auth account',
    react: React.createElement(EmailVerificationEmail, { token })
    // react: <EmailVerification token={token} />
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  await resend.emails.send({
    //! You can change this if you have a own domain
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your IGMT Auth password',
    react: React.createElement(PasswordResetEmail, { token })
    // react: <EmailVerification token={token} />
  })
}

export const send2FAEmail = async (email: string, token: string) => {
  await resend.emails.send({
    //! You can change this if you have a own domain
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Two-Factor Login Verification',
    react: React.createElement(TwoFactorAuthenticationEmail, { token })
  })
}

export const sendChangedPasswordNotificationEmail = async (email: string) => {
  await resend.emails.send({
    //! You can change this if you have a own domain
    from: 'onboarding@resend.dev',
    to: email,
    subject: '[IGMT Auth] Your password has changed',
    react: React.createElement(ChangedPasswordNotificationEmail)
  })
}
