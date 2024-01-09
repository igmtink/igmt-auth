import { badgeVariants } from '@/components/ui/badge'
import Link from 'next/link'

export default async function Home() {
  return (
    <section className='flex h-full items-center justify-center'>
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>IGMT NEXTAUTH</h1>
        <p>This project is for reviewer of Next-Auth V5</p>

        <p>
          For testing this Next-Auth V5 just change the route on this following
          pathname
        </p>

        <div className='grid grid-cols-2 justify-items-center rounded-md bg-card p-4 shadow-md'>
          <div className='space-y-4'>
            <p className='font-bold'>ROUTE</p>

            <ul className='space-y-2 text-sm font-medium'>
              <li>Login</li>
              <li>Signup</li>
              <li>Client</li>
              <li>Server</li>
              <li>Settings</li>
            </ul>
          </div>

          <div className='space-y-4'>
            <p className='font-bold'>PATHNAME</p>

            <ul className='space-y-2 text-sm font-medium'>
              <li>
                <Link
                  href='/login'
                  className={badgeVariants({ variant: 'default' })}
                >
                  /login
                </Link>
              </li>
              <li>
                <Link
                  href='/signup'
                  className={badgeVariants({ variant: 'default' })}
                >
                  /signup
                </Link>
              </li>
              <li>
                <Link
                  href='/client'
                  className={badgeVariants({ variant: 'default' })}
                >
                  /client
                </Link>
              </li>
              <li>
                <Link
                  href='/server'
                  className={badgeVariants({ variant: 'default' })}
                >
                  /server
                </Link>
              </li>
              <li>
                <Link
                  href='/settings'
                  className={badgeVariants({ variant: 'default' })}
                >
                  /settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
