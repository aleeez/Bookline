import mysql from 'mysql2/promise.js';

async function createPool() {
  const db = await mysql.createPool({
    host: '10.3.96.3',
    port: 3306,
    user: 'root',
    password: ':\u0026onVvH7xm(z8QEy7dEP',
    database: 'library',
    connectionLimit: 100,
    connectTimeout: 300000
  });
  return db;
}

export const db = await createPool();
