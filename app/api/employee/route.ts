import { NextResponse } from 'next/server';
import pool from '@/lib/sql/mysql';

// 获取员工列表
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM employee ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: '获取员工列表失败' }, { status: 500 });
  }
}

// 添加员工
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, employee_id, department, position, phone, email, hire_date, status } = data;

    const [result] = await pool.query(
      'INSERT INTO employee (name, employee_id, department, position, phone, email, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, employee_id, department, position, phone, email, hire_date, status]
    );

    return NextResponse.json({ message: '添加成功', id: (result as any).insertId });
  } catch (error) {
    return NextResponse.json({ error: '添加员工失败' }, { status: 500 });
  }
} 