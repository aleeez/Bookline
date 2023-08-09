import mysql from 'mysql2/promise.js';

async function createPool() {
  const db = await mysql.createPool({
    host: '34.155.250.34',
    user: 'root',
    password: "j:&9ZJYf'23-6Mh?",
    database: 'library',
    connectionLimit: 100,
  });
  return db;
}

export const db = await createPool();
