import { NextResponse } from 'next/server';
import pool from '@/lib/sql/mysql';

// 更新员工信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { name, employee_id, department, position, phone, email, hire_date, status } = data;
    const id = params.id;

    await pool.query(
      'UPDATE employee SET name = ?, employee_id = ?, department = ?, position = ?, phone = ?, email = ?, hire_date = ?, status = ? WHERE id = ?',
      [name, employee_id, department, position, phone, email, hire_date, status, id]
    );

    return NextResponse.json({ message: '更新成功' });
  } catch (error) {
    return NextResponse.json({ error: '更新员工信息失败' }, { status: 500 });
  }
}

// 删除员工
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await pool.query('DELETE FROM employee WHERE id = ?', [id]);
    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除员工失败' }, { status: 500 });
  }
} 