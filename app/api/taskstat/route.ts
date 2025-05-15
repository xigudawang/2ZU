import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../lib/sql/mysql';
import { Task, TaskState } from '../../dashboard/taskstat/types';


export async function GET(request: NextRequest){
    try{
        // 统计总任务数
        const totalTasksQuery = 'SELECT COUNT(*) as count FROM task';
        const [totalTasksResult] = await executeQuery<{ count: number }>(totalTasksQuery);
        const totalTasks = totalTasksResult.count;



        return NextResponse.json({
            totalTasks
        })
    }catch (error){
        console.error('Error fetching task statistics:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}