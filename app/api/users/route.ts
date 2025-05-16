
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/sql/mysql';


export const GET = async (request: Request) => {
    try {
        const [res] = await pool.execute("SELECT id, username FROM user");
        return NextResponse.json(res);
    } catch (error) {
        console.error('获取用户列表出错:', error);
        return NextResponse.json({ error: '获取用户列表失败，请稍后重试' }, { status: 500 });
    }
};