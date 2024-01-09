import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import React from 'react'

const baseUrl = process.env.IGMT_NEXTAUTH_URL

export const PasswordResetEmail: React.FC<TPasswordResetToken> = ({
  token
}) => {
  const resetLink = `${baseUrl}/auth/change-password?token=${token}`
  return (
    <Html>
      <Head />
      <Preview>We received a request to reset your password.</Preview>
      <Tailwind>
        <Body className='flex items-center justify-center bg-black py-12 font-sans text-white'>
          <Container className='w-[640px] rounded-md bg-[#121212] p-6 shadow-md'>
            <Heading className='text-4xl font-bold'>IGMT NextAuth</Heading>
            <Section>
              <Text className='mb-6 mt-0 text-xl font-medium'>
                Reset your password
              </Text>

              <Text className='mb-6 mt-0'>
                Click the button below to reset the password for your account.
              </Text>

              <Button
                className='inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#3b48f1] px-3 py-2 text-xs font-medium text-white'
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
