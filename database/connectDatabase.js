import mysql from 'mysql2/promise.js';

async function createPool() {
  const db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'abcdef',
    database: 'library',
    connectionLimit: 10,
  });
  return db;
}

export const db = await createPool();
