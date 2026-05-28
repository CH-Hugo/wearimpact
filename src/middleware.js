import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/garde-robe', '/dashboard']

  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/garde-robe', '/dashboard']
}