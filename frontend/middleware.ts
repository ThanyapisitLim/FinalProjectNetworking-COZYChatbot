import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // กำหนด path ที่ต้องมีการ login ก่อนเข้าถึง
    if (request.nextUrl.pathname.startsWith('/chatbot') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/chatbot/:path*'],
};