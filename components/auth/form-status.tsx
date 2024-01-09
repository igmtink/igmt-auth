import {
  ExclamationTriangleIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons'
import React from 'react'

export const FormError: React.FC<TFormStatus> = ({ message }) => {
  if (!message) return null

  return (
    <div className='flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
      <ExclamationTriangleIcon className='h4 w-4' />
      <p>{message}</p>
    </div>
  )
}

export const FormSuccess: React.FC<TFormStatus> = ({ message }) => {
  if (!message) return null

  return (
    <div className='flex items-center gap-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500'>
      <CheckCircledIcon className='h4 w-4' />
      <p>{message}</p>
    </div>
  )
}
