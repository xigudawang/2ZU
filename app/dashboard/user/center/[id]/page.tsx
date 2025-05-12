'use client'
import { useParams } from "next/navigation";
import { getUserDetail } from "@/app/dashboard/user/center/[id]/user-center";
import { useEffect, useState } from "react";

interface User {
    account: string,
    username: string,
    phone: string,
    mail: string,
    permission: number, // 0: 普通用户, 1: 管理员
    taskTotal: number,
    pendingCount: number,
    readyCount: number,
    expiredCount: number,
}

export default function Center() {
    const userId = useParams().id as unknown as number; // 获取动态ID
    const [user, setUser] = useState<User>({})
    const initUserData = async () => {
        const res = await getUserDetail(userId)
        setUser(res[0])
    }
    useEffect(() => {
        initUserData();
    }, [])
    return (
        <div className="flex justify-center min-h-screen py-5">
            <div className="w-full max-w-4xl bg-gray-200 p-6 rounded-lg">
                <div className={"flex justify-center text-2xl"}>
                    个人资料
                </div>
                {/* 账号信息 */}
                <div
                    className="mt-5 bg-gray-50 p-6 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-sm">
                    <div className="space-y-4">
                        <div
                            className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-gray-600">账号</span>
                            <span className="font-medium text-gray-800">{user.account}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-gray-600">用户名</span>
                            <div className="flex items-center">
                                <span className="font-medium text-gray-800 mr-2">{user.username}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.permission == '1' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}>{user.permission == 0 ? "普通用户" : "管理员"}
                                </span>
                            </div>
                        </div>
                        <div
                            className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-gray-600">邮箱</span>
                            <span className="font-medium text-gray-800">{user.mail}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">手机号</span>
                            <span className="font-medium text-gray-800">{user.phone}</span>
                        </div>
                    </div>
                </div>
                <div
                    className="mt-5 bg-gray-50 p-6 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-sm">
                    <div className="space-y-6">
                        {/* 任务总量卡片 */}
                        <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden group">
                            {/* 背景装饰 */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
                            <div
                                className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 transition-transform duration-700 group-hover:scale-150"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <p className="text-sm font-medium text-white/80">任务总量</p>
                                    <h2 className="text-4xl font-bold mt-1">
                                        {user.taskTotal}
                                    </h2>
                                    {/*<p className="text-sm text-white/90 mt-2 flex items-center">*/}
                                    {/*    比上月增加 8%*/}
                                    {/*</p>*/}
                                </div>
                                <div
                                    className="mt-4 md:mt-0 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <i className="fa fa-tasks text-2xl"></i>
                                </div>
                            </div>

                        </div>

                        {/* 任务状态卡片 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* 已完成任务卡片 */}
                            <div
                                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">已完成</p>
                                        <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                            {user.readyCount}
                                        </h3>
                                        {/*<p className="text-sm text-green-600 mt-2 flex items-center">*/}
                                        {/*    比上月增加 12%*/}
                                        {/*</p>*/}
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <i className="fa fa-check-circle text-green-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            {/* 未完成任务卡片 */}
                            <div
                                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">未完成</p>
                                        <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                            {user.pendingCount}
                                        </h3>
                                        {/*<p className="text-sm text-blue-600 mt-2 flex items-center">*/}
                                        {/*    比上月减少 3%*/}
                                        {/*</p>*/}
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <i className="fa fa-hourglass-half text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            {/* 已过期任务卡片 */}
                            <div
                                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">已过期</p>
                                        <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                            {user.expiredCount}
                                        </h3>
                                        {/*<p className="text-sm text-red-600 mt-2 flex items-center">*/}
                                        {/*    比上月增加 1 个*/}
                                        {/*</p>*/}
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <i className="fa fa-exclamation-circle text-red-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};