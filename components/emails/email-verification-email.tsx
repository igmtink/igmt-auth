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

export const EmailVerificationEmail: React.FC<TEmailVerificationToken> = ({
  token
}) => {
  const confirmLink = `${baseUrl}/auth/confirm-account?token=${token}`
  return (
    <Html>
      <Head />
      <Preview>
        Before we can get started, we need to confirm your account.
      </Preview>
      <Tailwind>
        <Body className='flex items-center justify-center bg-black py-12 font-sans text-white'>
          <Container className='w-[640px] rounded-md bg-[#121212] p-6 shadow-md'>
            <Heading className='text-4xl font-bold'>IGMT NextAuth</Heading>
            <Section>
              <Text className='mb-6 mt-0 text-xl font-medium'>
                Confirm your account
              </Text>

              <Text className='mb-6 mt-0'>
                Thank you for signing up for IGMT NextAuth. To confirm your
                account, please follow the button below.
              </Text>

              <Button
                className='inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#3b48f1] px-3 py-2 text-xs font-medium text-white'
                href={confirmLink}
              >
                Confirm Account
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
