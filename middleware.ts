import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {REDIRECTS} from "./src/utils/endpoints";

export function middleware(request: NextRequest) {
    const redirect = REDIRECTS.find(r => r.source === request.nextUrl.pathname)

    if (redirect) {
        return NextResponse.redirect(new URL(redirect.destination, request.url))
    }
}

export const config = {
    matcher: REDIRECTS.map(r => r.source),
}