// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret')

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    try {
        await jwtVerify(token, JWT_SECRET)
        return NextResponse.next()
    } catch (err) {
        console.error('JWT 验证失败:', err)
        return NextResponse.redirect(new URL('/login', req.url))
    }
}

export const config = {
    matcher: ['/dashboard/:path*'] // 需要保护的路径
}