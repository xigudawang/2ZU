'use client';
import { useState, useEffect } from 'react';
import { message, Select, Spin } from 'antd';

const { Option } = Select;

const TaskDispatchPage = () => {
    const [receiverId, setReceiverId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [senderId, setSenderId] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 从 API 获取用户列表
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoadingUsers(true);
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                message.error('获取用户列表失败，请稍后重试');
            } finally {
                setIsLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    const validateForm = () => {
        if (!receiverId) {
            message.error('请选择接收者');
            return false;
        }
        if (!title) {
            message.error('请输入任务标题');
            return false;
        }
        if (!description) {
            message.error('请输入任务详情');
            return false;
        }
        if (!deadline) {
            message.error('请选择截止日期');
            return false;
        }
        if (!senderId) {
            message.error('请选择发送者');
            return false;
        }
        return true;
    };

    const handleDispatch = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/taskdispatch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    receiverId: parseInt(receiverId),
                    title,
                    description,
                    deadline,
                    senderId: parseInt(senderId)
                }),
            });

            const data = await response.json();

            if (response.ok) {
                message.success(data.message);
                setReceiverId('');
                setTitle('');
                setDescription('');
                setDeadline('');
                setSenderId('');
            } else {
                message.error(data.error);
            }
        } catch (error) {
            console.error('请求出错:', error);
            message.error('请求出错，请稍后重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">任务派遣</h1>
                </div>
                {isLoadingUsers ? (
                    <div className="text-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="receiverId" className="block mb-1 text-gray-600 font-medium">接收者:</label>
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="请选择或搜索接收者"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                (String(option?.label ?? '')).toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => setReceiverId(value)}
                                value={receiverId || undefined}
                            >
                                {users.map((user) => (
                                    <Option key={user.id} value={user.id} label={user.username}>
                                        {user.username} (ID: {user.id})
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="title" className="block mb-1 text-gray-600 font-medium">任务标题:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-1 text-gray-600 font-medium">任务详情:</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="deadline" className="block mb-1 text-gray-600 font-medium">截止日期:</label>
                            <input
                                type="datetime-local"
                                id="deadline"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="senderId" className="block mb-1 text-gray-600 font-medium">发送者:</label>
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="请选择或搜索发送者"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                (String(option?.label ?? '')).toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => setSenderId(value)}
                                value={senderId || undefined}
                            >
                                {users.map((user) => (
                                    <Option key={user.id} value={user.id} label={user.username}>
                                        {user.username} (ID: {user.id})
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <button
                            onClick={handleDispatch}
                            className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 focus:outline-none"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '提交中...' : '派遣任务'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDispatchPage;