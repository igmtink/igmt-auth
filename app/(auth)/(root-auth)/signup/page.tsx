import { SignUpForm } from '@/app/(auth)/(root-auth)/_components/signup-form'
import { SocialLogin } from '@/app/(auth)/(root-auth)/_components/social-login'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up'
}

export default function SignUp() {
  return (
    <div className='flex w-full flex-col items-center gap-8 px-4 pb-20 pt-16 md:pt-40'>
      <div>
        <h1 className='text-2xl'>Nice to meet you.</h1>
      </div>

      <Card
        title='Sign Up'
        description='Please fill below form to register new account.'
        className='max-w-md'
      >
        <SocialLogin />

        <div className='flex items-center justify-center gap-4 text-muted-foreground'>
          <Separator className='shrink' /> or <Separator className='shrink' />
        </div>

        <SignUpForm />
      </Card>
    </div>
  )
}
