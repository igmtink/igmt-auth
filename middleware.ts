//! Using (Middleware) is to invoke a logic or function every we entering a routes

import NextAuth from 'next-auth'

import authConfig from '@/auth.config'

const { auth } = NextAuth(authConfig)

import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  apiAuthPrefix,
  publicRoutes
} from '@/routes'

//! This is the logic of middleware to check the user is authenticated & if the routes is protected
export default auth(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname)

  //! If the route is on (/api/auth) doesn't need autheticated
  if (isApiAuthRoute) {
    return null
  }

  //! If the route is on (/login) or (/signup) then check if the user (isLoggedIn) redirect to (DEFAULT_LOGIN_REDIRECT) route
  if (isAuthRoutes) {
    if (isLoggedIn) {
      //! In the middleware and the (new URL) constructor you also have to pass (nextUrl) as the last argument because it will create a absolute path (localhost:3000/DEFAULT_LOGIN_REDIRECT)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }

    return null
  }

  //! If the user is not (isLoggedIn) & is not on (isPublicRoutes) redirect to (/login) route
  if (!isLoggedIn && !isPublicRoutes) {
    let callbackUrl = nextUrl.pathname

    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    //! (encodeURIComponent) to encode characters from url such as (?, =, /, &, :)
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return null
})

//! (matcher) is to invoke middleware on some paths
// Optionally, don't invoke Middleware on some paths
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
// }

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
