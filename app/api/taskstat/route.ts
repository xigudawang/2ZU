import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../lib/sql/mysql';
import { Task, TaskState } from '../../dashboard/taskstat/types';


export async function GET(request: NextRequest){
    try{
        // 统计总任务数
        const totalTasksQuery = 'SELECT COUNT(*) as count FROM task';
        const [totalTasksResult] = await executeQuery<{ count: number }>(totalTasksQuery);
        const totalTasks = totalTasksResult.count;


        // 统计已接受任务数（receiver_id不为null）
        const acceptedTasksQuery = 'SELECT COUNT(*) as count FROM task WHERE receiver_id IS NOT NULL';
        const [acceptedTasksResult] = await executeQuery<{ count: number }>(acceptedTasksQuery);
        const acceptedTasks = acceptedTasksResult.count;

        // 统计已完成和未完成任务数
        const stateTasksQuery = 'SELECT task_state, COUNT(*) as count FROM task GROUP BY task_state';
        const stateTasks = await executeQuery<{ task_state: TaskState; count: number }>(stateTasksQuery);

        const completedTasks = stateTasks.find(t => t.task_state === TaskState.COMPLETED)?.count || 0;
        const pendingTasks = stateTasks.find(t => t.task_state === TaskState.PENDING)?.count || 0;

        return NextResponse.json({
            totalTasks,
            acceptedTasks,
            completedTasks,
            pendingTasks,
        })
    }catch (error){
        console.error('Error fetching task statistics:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}