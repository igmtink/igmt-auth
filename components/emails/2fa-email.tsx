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

export const TwoFactorAuthenticationEmail: React.FC<TTwoFactorToken> = ({
  token
}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your login requires an 2FA to access your IGMT Auth account.
      </Preview>
      <Tailwind>
        <Body className='flex items-center justify-center bg-black py-12 font-sans text-white'>
          <Container className='w-[640px] rounded-md bg-[#121212] p-6 shadow-md'>
            <Heading className='text-4xl font-bold'>IGMT Auth</Heading>
            <Section>
              <Text className='mb-6 mt-0 text-xl font-medium'>
                Two Factor Authentication
              </Text>

              <Text className='mb-6 mt-0'>
                The 2FA code is: <strong>{token}</strong>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
