import type { Metadata } from 'next'
import { Poppins as FontSans } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'

import { Toaster } from '@/components/ui/sonner'

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: {
    template: '%s - IGMT NextAuth',
    default: 'IGMT NextAuth'
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh')
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  )
}
