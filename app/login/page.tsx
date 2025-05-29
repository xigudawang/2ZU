'use client'

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState(""); // 存储邮箱
    const [password, setPassword] = useState(""); // 存储密码
    const [errorMessage, setErrorMessage] = useState(""); // 错误信息
    const router = useRouter(); // 用于跳转页面

    // 登录处理函数
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // 检查邮箱和密码是否为空
        if (!email || !password) {
            setErrorMessage("邮箱和密码不能为空");
            return;
        }

        try {
            const res = await axios.post('/api/auth/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (res.data.message === '登录成功') {
                localStorage.setItem("username",res.data.user.username);
                localStorage.setItem("id",res.data.user.id);
                router.push('/dashboard'); // ✅ 正确跳转
            } else {
                setErrorMessage(res.data.error || '登录失败');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('登录失败，请稍后重试');
        }
    };

    return (
        <div className="login-container flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">登录</h2>

                {/* 错误信息显示 */}
                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">邮箱</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}  // 更新邮箱
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="请输入邮箱"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">密码</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}  // 更新密码
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="请输入密码"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md"
                    >
                        登录
                    </button>
                </form>

                {/* 注册跳转按钮 */}
                <div className="text-center mt-4">
                    还没有账号？
                    <button
                        onClick={() => router.push('/register')}
                        className="text-blue-500 hover:underline ml-1"
                    >
                        去注册
                    </button>
                </div>
            </div>
        </div>
    );
}
