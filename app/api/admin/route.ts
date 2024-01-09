import { currentUserRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { NextResponse } from 'next/server'

//! (ROLE GATE) inside of (API ROUTE)
export async function GET() {
  const userRole = await currentUserRole()

  if (userRole === UserRole.ADMIN)
    return new NextResponse(null, { status: 200 })
  return new NextResponse(null, { status: 403 })
}
