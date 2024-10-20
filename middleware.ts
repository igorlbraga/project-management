import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhook"])
const isSelectOrgRoute = createRouteMatcher(["/select-org"])

export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) auth().protect()

    if (auth().userId) {
        if (isPublicRoute(request) || (!auth().orgId && !isSelectOrgRoute(request))) {
            let path = "/select-org"
            if (auth().orgId) path = `/organization/${auth().orgId}`
            return NextResponse.redirect(new URL(path, request.url))
        }
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ]
}
