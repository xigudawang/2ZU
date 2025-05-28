import pool from "@/lib/sql/mysql";
import {NextResponse} from "next/server";

export const GET = async (request: Request) => {
    try {
        const [res] = await pool.execute("SELECT task.*,sender.username AS sender_username,receiver.username AS receiver_username\n" +
            "FROM task\n" +
            "LEFT JOIN `user` sender ON task.sender_id = sender.id\n" +
            "LEFT JOIN `user` receiver ON task.receiver_id = receiver.id;");
        return NextResponse.json(res);
    } catch (error) {
        console.error('数据库查询错误:', error);
        return NextResponse.json({error: '数据库查询错误!'}, {status: 500});
    }
}