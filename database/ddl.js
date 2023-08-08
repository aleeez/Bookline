import { db } from './connectDatabase.js';

const createBooks = `CREATE TABLE IF NOT EXISTS books (
  bookID INT PRIMARY KEY auto_increment,
  isbn INT NOT NULL,
  title VARCHAR(50),
  author VARCHAR(50),
  year INT,
  description VARCHAR(50),
  instance INT,
  filename VARCHAR(50),
  UNIQUE (isbn)
);`;

const createBorrow = `CREATE TABLE IF NOT EXISTS borrowed (
  borrowID INT PRIMARY KEY AUTO_INCREMENT,
  userID INT,
  bookID INT,
  stillInPossess TINYINT(1) DEFAULT 1,
  FOREIGN KEY (userID) REFERENCES users(userID),
  FOREIGN KEY (bookID) REFERENCES books(bookID)
);`;

const createUsers = `CREATE TABLE IF NOT EXISTS users (
  userID INT PRIMARY KEY auto_increment,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  username VARCHAR(50),
  hashedPassword VARCHAR(255),
  role VARCHAR(50) DEFAULT "user"
);`;

async function createTable(myquery) {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.query(myquery);
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function createAllTables() {
  try {
    await Promise.all([createTable(createBooks), createTable(createUsers), createTable(createBorrow)]);
  } catch (err) {
    console.error('Error creating all tables:', err);
  }
}
