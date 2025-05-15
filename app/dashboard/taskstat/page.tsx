'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, Col, Row, Statistic, Table, Tabs, Typography, Skeleton, Space } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { TaskStats } from './types';

const { Title } = Typography;


const TaskStatisticsPage = () =>{
    const [stats, setStats] = useState<TaskStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const pieChartRef = useRef<HTMLDivElement>(null);
    // const barChartRef = useRef<HTMLDivElement>(null);

    useEffect(() =>{
        const fetchStats = async () =>{
            try{
                const response = await fetch('/api/taskstat');
                if (!response.ok){
                    throw new Error('Failed to fetch task statistics');
                }
                const data = await response.json();
                setStats(data);
            }catch (err){
                console.error('Error fetching task statistics:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }finally {
                setLoading(false);
            }
        };
        fetchStats();
    },[]);

    return(
        <div className="p-6">
        <Title level={3}>任务统计分析</Title>


    {loading && (
        <Skeleton active paragraph={{ rows: 10 }} />
    )}

    {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">错误:</strong>
            <span className="block sm:inline ml-2">{error}</span>
        </div>
    )}

    {stats && (
        <>
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总任务数"
                            value={stats.totalTasks}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )}
        </div>
    );
};

export default TaskStatisticsPage;