import { NextResponse } from 'next/server';
import pool from '@/lib/sql/mysql';
import bcrypt from 'bcrypt';

// 更新员工信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { email, password, username, phone, permission } = body;

    // 验证必填字段
    if (!email || !username) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已被其他用户使用
    const [existingUsers] = await pool.query(
      'SELECT id FROM user WHERE email = ? AND id != ?',
      [email, id]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { error: '邮箱已被其他用户使用' },
        { status: 400 }
      );
    }

    // 如果提供了新密码，则更新密码
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE user SET email = ?, password = ?, username = ?, phone = ?, permission = ? WHERE id = ?',
        [email, hashedPassword, username, phone, permission, id]
      );
    } else {
      // 不更新密码
      await pool.query(
        'UPDATE user SET email = ?, username = ?, phone = ?, permission = ? WHERE id = ?',
        [email, username, phone, permission, id]
      );
    }

    return NextResponse.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新员工信息失败:', error);
    return NextResponse.json(
      { error: '更新员工信息失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// 删除员工
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await pool.query('DELETE FROM user WHERE id = ?', [id]);
    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除员工失败:', error);
    return NextResponse.json(
      { error: '删除员工失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 