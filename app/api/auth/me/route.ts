import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function GET() {
    const token = cookies().get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: '无效 token' }, { status: 401 });
    }
}