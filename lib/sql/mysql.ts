import mysql, { Pool, PoolOptions } from 'mysql2/promise';

/**
 * mysql连接配置
 */
const poolOptions: PoolOptions = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "task_system",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// 创建连接池
const pool: Pool = mysql.createPool(poolOptions);
console.log(pool);

export default pool;