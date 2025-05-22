'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, Col, Row, Statistic, Table, Tabs, Typography, Skeleton, Space } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { TaskStats } from './types';
import * as echarts from 'echarts';

const { Title } = Typography;


const TaskStatisticsPage = () =>{
    const [stats, setStats] = useState<TaskStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
     const pieChartRef = useRef<HTMLDivElement>(null);
     const barChartRef = useRef<HTMLDivElement>(null);



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

    useEffect(() => {
        if (stats && pieChartRef.current && barChartRef.current) {
            // 初始化饼图
            const pieChart = echarts.init(pieChartRef.current);
            const pieOption = {
                title: {
                    text: '任务完成状态',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: '任务数',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {value: stats.completedTasks, name: '已完成'},
                            {value: stats.pendingTasks, name: '未完成'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            pieChart.setOption(pieOption);

            // 初始化柱状图
            const barChart = echarts.init(barChartRef.current);

            // 转换数据格式并排序
            const distributionData = Object.entries(stats.taskDistribution)
                .map(([userId, count]) => ({userId, count}))
                .sort((a, b) => b.count - a.count);

            const barOption = {
                title: {
                    text: '任务分布 (按用户)',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: distributionData.map(item => `用户${item.userId}`)
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '任务数',
                        type: 'bar',
                        data: distributionData.map(item => item.count),
                        itemStyle: {
                            color: '#1890ff'
                        }
                    }
                ]
            };
            barChart.setOption(barOption);

            // 窗口大小变化时重绘图表
            const resizeHandler = () => {
                pieChart.resize();
                barChart.resize();
            };

            window.addEventListener('resize', resizeHandler);

            // 组件卸载时清理
            return () => {
                window.removeEventListener('resize', resizeHandler);
                pieChart.dispose();
                barChart.dispose();
            };
        }
        }, [stats]);

    const taskDistributionData = stats
        ? Object.entries(stats.taskDistribution).map(([userId, count]) => ({
            key: userId,
            userId,
            taskCount: count,
        }))
        : [];

    const tableColumns = [
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
            render: (text) => <span>{text}</span>,
        },
        {
            title: '任务数量',
            dataIndex: 'taskCount',
            key: 'taskCount',
            render: (text) => <span>{text}</span>,
        },
    ];

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
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="已接受任务"
                            value={stats.acceptedTasks}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="已完成任务"
                            value={stats.completedTasks}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="未完成任务"
                            value={stats.pendingTasks}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} className="mb-6">
                <Col span={12}>
                    <Card title="任务完成状态">
                        <div ref={pieChartRef} style={{ width: '100%', height: '400px' }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="任务分布 (按用户)">
                        <div ref={barChartRef} style={{ width: '100%', height: '400px' }} />
                    </Card>
                </Col>
            </Row>

            <Card className="mb-6">
                <Title level={4}>任务分布详情</Title>
                <Table
                    columns={tableColumns}
                    dataSource={taskDistributionData}
                    pagination={{ pageSize: 10 }}
                    loading={loading}
                />
            </Card>
        </>
    )}
        </div>
    );
};

export default TaskStatisticsPage;