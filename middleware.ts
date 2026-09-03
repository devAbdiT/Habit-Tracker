import NextAuth from "next-auth"
import { authConfig } from "./auth"

// Use the edge-safe config (no Prisma, no bcrypt) for middleware
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/((?!api/auth|api/register|_next/static|_next/image|favicon.ico).*)"],
}
