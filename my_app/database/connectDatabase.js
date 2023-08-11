import mysql from 'mysql2/promise.js';

async function createPool() {
  const db = await mysql.createPool({
    host: 'bookline-v2:europe-west3:bookline-v22-sql',
    port: 3306,
    user: 'root',
    password: 'PdhqJ1UKKajV[a$>',
    database: 'library',
    connectionLimit: 100,
    connectTimeout: 300000
  });
  return db;
}

export const db = await createPool();
