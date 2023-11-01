import { authMiddleware } from '@clerk/nextjs'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ['/', '/api/webhooks', '/api/webhooks/clerk'],
  // afterAuth(auth, req, evt) {
  //   if (
  //     auth.userId &&
  //     !auth.orgId &&
  //     req.nextUrl.pathname !== "/org-selection" &&
  //   ) {
  //     const orgSelection = new URL("/org-selection", req.url);
  //     return NextResponse.redirect(orgSelection);
  //   }
  // },
})

// TODO: Make this a bit more dynamic
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
