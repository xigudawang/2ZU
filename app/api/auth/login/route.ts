import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/sql/mysql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // 检查邮箱和密码是否为空
        if (!email || !password) {
            return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
        }

        // 查询用户信息
        const [rows]: any = await pool.execute(
            'SELECT * FROM user WHERE email = ? LIMIT 1',
            [email]
        );

        if (!rows.length) {
            return NextResponse.json({ error: '该邮箱未注册' }, { status: 401 });
        }

        const user = rows[0];

        // 校验密码
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: '密码错误' }, { status: 401 });
        }

        // 登录成功，签发 JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                permission: user.permission
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        const response = NextResponse.json({
            message: '登录成功',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                permission: user.permission
            }
        });
        // 设置 JWT 到 Cookie（供中间件读取）
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // 或 'none'
            path: '/',
            maxAge: 60 * 60 * 2,
        });


        return response;



    } catch (error) {
        console.error('登录处理出错:', error);
        return NextResponse.json({ error: '服务器错误，请稍后再试' }, { status: 500 });
    }
}