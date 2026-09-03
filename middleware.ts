import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup")
  const isAuthenticated = !!req.auth

  // Redirect unauthenticated users to signin
  if (!isAuthenticated && !isAuthPage) {
    const signInUrl = new URL("/signin", req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    const homeUrl = new URL("/", req.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api/auth|api/register|_next/static|_next/image|favicon.ico).*)"],
}
