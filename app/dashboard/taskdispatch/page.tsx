'use client';
import { useState } from 'react';
import { message } from 'antd';

const TaskDispatchPage = () => {
    const [receiverId, setReceiverId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [senderId, setSenderId] = useState('');

    const handleDispatch = async () => {
        try {
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
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">任务派遣</h1>
            <div className="mb-4">
                <label htmlFor="receiverId" className="block mb-1">接收者 ID:</label>
                <input
                    type="number"
                    id="receiverId"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="title" className="block mb-1">任务标题:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block mb-1">任务详情:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="deadline" className="block mb-1">截止日期:</label>
                <input
                    type="datetime-local"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="senderId" className="block mb-1">发送者 ID:</label>
                <input
                    type="number"
                    id="senderId"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>
            <button
                onClick={handleDispatch}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                派遣任务
            </button>
        </div>
    );
};

export default TaskDispatchPage;