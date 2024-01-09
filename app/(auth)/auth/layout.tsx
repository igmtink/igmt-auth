import React from 'react'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <section className='flex h-dvh items-center justify-center p-4 text-center'>
      {children}
    </section>
  )
}
