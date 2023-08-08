import mysql from 'mysql2/promise.js';

async function createPool() {
  const db = await mysql.createPool({
    host: '34.155.222.250',
    user: 'root',
    password: 'hcY(osHzuh)khdSn',
    database: 'library',
    connectionLimit: 100,
  });
  return db;
}

export const db = await createPool();
