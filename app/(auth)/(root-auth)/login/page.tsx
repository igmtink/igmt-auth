import { LogInForm } from '@/app/(auth)/(root-auth)/_components/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log In'
}

export default function LogIn() {
  return <LogInForm />
}
