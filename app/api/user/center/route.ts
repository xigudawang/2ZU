import pool from "@/lib/sql/mysql";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    // 解析查询参数
    const userId = new URL(request.url).searchParams.get('userId');
    console.log(userId);
    
    const [res] = await pool.execute("SELECT \n" +
        "  user.account,user.username,user.phone,user.mail,user.permission,\n" +
        "  COUNT(task.id) AS taskTotal,\n" +
        "  SUM(CASE WHEN task.task_state = 0 THEN 1 ELSE 0 END) AS pendingCount,\n" +
        "  SUM(CASE WHEN task.task_state = 1 THEN 1 ELSE 0 END) AS readyCount,\n" +
        "  SUM(CASE WHEN task.task_state = 2 THEN 1 ELSE 0 END) AS expiredCount\n" +
        "FROM \n" +
        "  `user`\n" +
        "LEFT JOIN \n" +
        "  task ON user.id = task.task_accept_id\n" +
        "WHERE \n" +
        "  user.id = ? GROUP BY user.id", [userId]);
    return NextResponse.json(res);
}