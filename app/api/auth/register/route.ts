import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/sql/mysql';

export async function POST(req: NextRequest) {
    try {
        const { email, password, username, phone } = await req.json();

        if (!email || !password || !username || !phone) {
            return NextResponse.json({ error: '请填写所有字段' }, { status: 400 });
        }

        // 检查邮箱是否已注册
        const [existing]: any = await pool.execute(
            'SELECT id FROM user WHERE email = ? LIMIT 1',
            [email]
        );
        if (existing.length > 0) {
            return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            `INSERT INTO user (email, password, username, phone, permission, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [email, hashedPassword, username, phone, 0]
        );

        return NextResponse.json({ message: '注册成功' });
    } catch (err) {
        console.error('注册出错:', err);
        return NextResponse.json({ error: '服务器错误' }, { status: 500 });
    }
}
