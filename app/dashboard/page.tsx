'use client'
import Link from 'next/link'
import {useEffect, useState} from "react";
import {Dropdown, MenuProps} from "antd";

// 页面组件定义 
const HomeContent = () => <div style={{marginLeft: '280px'}}>首页内容</div>
const UserListContent = () => <div style={{marginLeft: '280px'}}>用户列表</div>

const DashboardPage = () => {
    const [username, setUsername] = useState("")
    const [id, setId] = useState("")

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href={`/dashboard/user/center/${id}`}>
                    个人中心
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer"
                   onClick={(e) => {
                       // 执行退出逻辑（如清除token等）
                       localStorage.clear()
                       // 然后刷新页面
                       window.location.reload();
                   }}>
                    退出
                </a>
            ),
        },
    ];

    useEffect(() => {
        setUsername(localStorage.getItem("username"))
        setId(localStorage.getItem("id"))
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc'
        }}>
            {/* 顶栏 */}
            <header style={{
                background: 'white',
                padding: '16px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    letterSpacing: '-0.025em',
                    margin: 0
                }}>任务管理系统 </h1>

                <nav>
                    {username == null || username == "" ?
                        <Link
                            href="/login"
                            style={{
                                ...linkStyle,
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                padding: '8px 20px',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                ':hover': {
                                    backgroundColor: '#f1f5f9',
                                    transform: 'translateY(-1px)'
                                }
                            }}>
                            登录
                        </Link>
                        :
                        <Dropdown menu={{items}} placement="bottom">
                            <div>你好,{username}</div>
                        </Dropdown>
                    }
                </nav>
            </header>

            {/* 侧边栏 */}
            <aside style={{
                width: '240px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                position: 'fixed',
                left: '24px',
                top: '92px',
                padding: '20px 0'
            }}>
                <div style={{
                    borderLeft: '3px solid #3b82f6',
                    paddingLeft: '16px'
                }}>
                    {[
                        {path: "/dashboard", name: "首页"},
                        {path: "/dashboard/employee", name: "员工列表"},
                        {path: "/dashboard/tasklist", name: "任务中心"},
                        {path: "/dashboard/taskstat", name: "统计"}
                    ].map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                ...sidebarLink,
                                ':hover': {
                                    color: '#3b82f6',
                                    paddingLeft: '22px'
                                }
                            }}>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* 内容区域 */}
            <main>
                {/* 路由内容会自动加载到子页面 */}
            </main>
        </div>
    )
}

// 样式常量 
const linkStyle = {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.925rem'
} as const

const sidebarLink = {
    ...linkStyle,
    display: 'block',
    padding: '12px 20px',
    transition: 'all 0.25s ease',
    borderRadius: '6px'
} as const

export default DashboardPage