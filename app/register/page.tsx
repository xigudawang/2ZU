'use client';

import { useState } from 'react';

export default function RegisterPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        username: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert('注册成功');
            window.location.href = '/login';
        } else {
            const { error } = await res.json();
            alert(error || '注册失败');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">注册</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" name="email" placeholder="邮箱" required className="w-full border p-2" onChange={handleChange} />
                <input type="text" name="username" placeholder="用户名" required className="w-full border p-2" onChange={handleChange} />
                <input type="text" name="phone" placeholder="手机号" required className="w-full border p-2" onChange={handleChange} />
                <input type="password" name="password" placeholder="密码" required className="w-full border p-2" onChange={handleChange} />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">注册</button>
            </form>
        </div>
    );
}
