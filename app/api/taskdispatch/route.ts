import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/sql/mysql';
import { TaskState } from '../../dashboard/taskstat/types';

export async function POST(req: NextRequest) {
    try {
        const { receiverId, title, description, deadline, senderId } = await req.json();

        // 输入验证
        if (!receiverId) {
            return NextResponse.json({ error: '接收者 ID 是必需的' }, { status: 400 });
        }

        // 检查接收者是否存在
        const [userRows] = await pool.execute('SELECT id FROM user WHERE id = ?', [receiverId]);
        if ((userRows as any[]).length === 0) {
            return NextResponse.json({ error: '指定的接收者不存在' }, { status: 404 });
        }

        // 保存新任务到数据库
        const [insertResult] = await pool.execute(
            'INSERT INTO task (title, description, deadline, sender_id, receiver_id, task_state) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, deadline, senderId, receiverId, TaskState.PENDING]
        );

        if ((insertResult as any).affectedRows === 0) {
            return NextResponse.json({ error: '任务保存失败' }, { status: 500 });
        }

        return NextResponse.json({ message: '任务保存并分配成功' });
    } catch (error) {
        console.error('任务保存和分配出错:', error);
        return NextResponse.json({ error: '任务保存和分配失败，请稍后重试' }, { status: 500 });
    }
}
