import { NextResponse } from 'next/server';
import pool from '@/lib/sql/mysql';
import bcrypt from 'bcrypt';

// 获取员工列表
export async function GET() {
  try {
    console.log('Attempting to fetch employees...');
    
    // 测试连接
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    
    try {
      const [rows] = await connection.query(
        'SELECT id, email, username, phone, permission, created_at, updated_at FROM user ORDER BY id DESC'
      );
      console.log('Query result:', rows);
      
      // Ensure we're returning a proper array
      const employees = Array.isArray(rows) ? rows : [];
      console.log('Processed employees:', employees);
      
      return NextResponse.json(employees);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('获取员工列表失败:', error);
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: '获取员工列表失败', 
        details: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 添加员工
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, phone, permission } = body;

    // 验证必填字段
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM user WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { error: '邮箱已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新员工
    const [result] = await pool.query(
      'INSERT INTO user (email, password, username, phone, permission) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, username, phone, permission || 0]
    );

    return NextResponse.json({ message: '添加成功', id: (result as any).insertId });
  } catch (error) {
    console.error('添加员工失败:', error);
    return NextResponse.json(
      { error: '添加员工失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 