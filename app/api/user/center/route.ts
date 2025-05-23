import pool from "@/lib/sql/mysql";
import {NextResponse} from "next/server";

export const GET = async (request: Request) => {
    // 解析查询参数
    const userId = new URL(request.url).searchParams.get('userId');
    const day = new Date()
    const [res] = await pool.execute("SELECT \n" +
        "  user.username,user.phone,user.email,user.permission,\n" +
        "  COUNT(task.id) AS taskTotal,\n" +
        "  SUM(CASE WHEN task.task_state = 0 and task.deadline > ? THEN 1 ELSE 0 END) AS pendingCount,\n" +
        "  SUM(CASE WHEN task.task_state = 1 THEN 1 ELSE 0 END) AS readyCount,\n" +
        "  SUM(CASE WHEN task.task_state = 0 and task.deadline < ? THEN 1 ELSE 0 END) AS expiredCount\n" +
        "FROM \n" +
        "  `user`\n" +
        "LEFT JOIN \n" +
        "  task ON user.id = task.receiver_id\n" +
        "WHERE \n" +
        "  user.id = ? GROUP BY user.id", [day, day, userId]);
    return NextResponse.json(res);
}