'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Employee {
  id: number;
  email: string;
  username: string;
  phone: string;
  permission: number;
  created_at?: string;
  updated_at?: string;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const columns: ColumnsType<Employee> = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      render: (permission: number) => (permission === 1 ? '管理员' : '普通用户'),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('获取员工列表失败:', error);
      message.error('获取员工列表失败');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Employee) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      password: '', // 编辑时不显示密码
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/employee/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除失败');
      }
      message.success('删除成功');
      fetchEmployees();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/employee/${editingId}` : '/api/employee';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`${editingId ? '更新' : '添加'}失败`);
      }

      message.success(`${editingId ? '更新' : '添加'}成功`);
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
      message.error(`${editingId ? '更新' : '添加'}失败`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button type="primary" onClick={handleAdd}>
          添加员工
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingId ? '编辑员工' : '添加员工'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: !editingId, message: '请输入密码' },
              { min: 6, message: '密码长度不能小于6个字符' }
            ]}
          >
            <Input.Password placeholder={editingId ? '不修改请留空' : '请输入密码'} />
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, message: '用户名长度不能小于2个字符' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="permission"
            label="权限"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Select>
              <Select.Option value={1}>管理员</Select.Option>
              <Select.Option value={0}>普通用户</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 