'use client'
import {message, Table} from "antd";
import {useEffect, useState} from "react";

interface Task {
    id: string;
    title: string;
    sender_username: string;
    receiver_username: string;
    task_state: number;
    deadline: string;
    created_at: string;
}

export default function page() {
    const [tasks, setTask] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            title: '任务ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '任务标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '发布者',
            dataIndex: 'sender_username',
            key: 'sender_username',
        },
        {
            title: '接收者',
            dataIndex: 'receiver_username',
            key: 'receiver_username',
        },
        {
            title: '任务状态',
            dataIndex: 'task_state',
            key: 'task_state',
            render: (task_state: number) => (task_state === 0 ? '未完成' : '已完成'),
        },
        {
            title: '任务截止时间',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleString(),
        },
    ];
    const initTaskData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/tasklist');
            const data = await response.json();
            setTask(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error('获取任务列表失败');
            setTask([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initTaskData();
    }, []);

    return (
        <div className="p-7">
            <div className="mb-4">
                <Table
                    columns={columns}
                    dataSource={tasks}
                    rowKey="id"
                    loading={loading}
                />
            </div>
        </div>
    )
}