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

const baseUrl = process.env.IGMT_AUTH_URL

export const ChangedPasswordNotificationEmail = () => {
  const resetLink = `${baseUrl}/auth/reset-password`
  return (
    <Html>
      <Head />
      {/* <Preview>We received a request to reset your password.</Preview> */}
      <Tailwind>
        <Body className='flex items-center justify-center bg-black py-12 font-sans text-white'>
          <Container className='w-[640px] rounded-md bg-[#121212] p-6 shadow-md'>
            <Heading className='text-4xl font-bold'>IGMT Auth</Heading>
            <Section>
              <Text className='mb-6 mt-0'>
                We wanted to let you know that your <strong>IGMT Auth</strong>{' '}
                password has changed.
              </Text>

              <Button
                className='mb-6 mt-0 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#3b48f1] px-3 py-2 text-xs font-medium text-white'
                href={resetLink}
              >
                Reset Password
              </Button>

              <Text>
                Please do not reply to this email with your password. We will
                never ask for your password, and we strongly discourage you from
                sharing it with anyone.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
