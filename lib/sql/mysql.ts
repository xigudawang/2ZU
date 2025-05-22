import mysql, { Pool, PoolOptions } from 'mysql2/promise';

/**
 * mysql连接配置
 */
const poolOptions: PoolOptions = {
    host: "localhost",
    user: "root",
    password: "150114",
    database: "task_system",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// 创建连接池
const pool: Pool = mysql.createPool(poolOptions);
console.log(pool);


export const executeQuery = async <T>(query: string, values?: any[]): Promise<T[]> => {
    try {
        const [rows] = await pool.execute(query, values);
        return rows as T[];
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export default pool;