import fs from 'fs';
import { db } from './connectDatabase.js';

export function findAll() {
  return db.getConnection().then((connection) => {
    connection
      .query('SELECT * FROM books')
      .then((result) => fs.readFile(result))
      .catch((err) => console.log(err));
  });
}

export function allUsers() {
  return db.getConnection().then((connection) =>
    connection
      .query('SELECT username, role FROM users')
      .then((result) => result[0])
      .catch((err) => console.log(err)),
  );
}

export function insertBook(book) {
  return db.getConnection().then((connection) =>
    connection
      .query(
        `INSERT INTO books (isbn, title, author, year, description, instance, filename)
      values (?, ?, ?, ?, ?, ?, ?)`,
        [book.isbn, book.title, book.author, book.year, book.description, book.instance, book.picture],
      )
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        connection.release();
      }),
  );
}
export function insertUser(user) {
  return db.getConnection().then((connection) =>
    connection
      .query(
        `INSERT INTO users (firstName, lastName, username, hashedPassword)
      values (?, ?, ?, ?);`,
        [user.fname, user.lname, user.username, user.hashedPassword],
      )
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function selectBooks() {
  return db.getConnection().then((connection) =>
    connection
      .query('SELECT * FROM books WHERE 1 = 1')
      .then((result) => result[0])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function selectFilteredBooks(filteres) {
  let customQuery = 'SELECT * FROM books WHERE 1 = 1';
  const myArgs = [];
  if (filteres.title && filteres.title !== '') {
    customQuery += ' AND books.title = ?';
    myArgs.push(filteres.title);
  }
  if (filteres.author && filteres.author !== '') {
    customQuery += ' AND author = ?';
    myArgs.push(filteres.author);
  }
  if (filteres.minyear && filteres.minyear === 'true') {
    customQuery += ' AND year = (SELECT MIN(year) FROM books)';
  }
  if (filteres.maxyear && filteres.maxyear === 'true') {
    customQuery += ' AND year = (SELECT MAX(year) FROM books)';
  }
  if (filteres.rarity && filteres.rarity === 'true') {
    customQuery += ' AND instance = 1';
  }
  customQuery += ';';
  return db.getConnection().then((connection) =>
    connection
      .execute(customQuery, myArgs, {
        typeCast: true,
      })
      .then((result) => result[0])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function checkBookExists(title) {
  return db.getConnection().then((connection) =>
    connection
      .query('SELECT 1 FROM books WHERE title = ?', [title])
      .then((result) => result[0].length > 0)
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function checkISBNExists(isbn) {
  return db.getConnection().then((connection) =>
    connection
      .query('SELECT 1 FROM books WHERE isbn = ?', [isbn])
      .then((result) => result[0].length > 0)
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function deleteBook(isbn) {
  return db.getConnection().then((connection) =>
    connection
      .query('DELETE FROM books WHERE isbn = ?', [isbn])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function checkUserExists(username) {
  return db.getConnection().then((connection) =>
    connection
      .query('SELECT 1 FROM users WHERE username = ?', [username])
      .then((result) => {
        console.log(result);
        return result[0].length > 0;
      })
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function getUser(username) {
  return db.getConnection().then((connection) =>
    connection
      .query('SELECT username, hashedPassword, role FROM users WHERE username = ?', [username])
      .then((result) => {
        console.log(result[0][0]);
        return result[0][0];
      })
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const fromborrowed = `SELECT borrowed.borrowID, CONCAT(users.firstName, ' ', users.lastName) AS name, borrowed.stillInPossess, books.filename
from borrowed 
join books on books.bookID = borrowed.bookID 
join users on users.userID = borrowed.userID
where books.title = ?;`;

export function selectBorrows(title) {
  return db.getConnection().then((connection) =>
    connection
      .query(fromborrowed, [title])
      .then((result) => result[0])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

export function selectUser(username) {
  return db.getConnection().then((connection) =>
    connection
      .query('SELECT firstName, lastName, username, role FROM users where username = ?', [username])
      .then((result) => result[0][0])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const check = `SELECT b.title, b.author, b.instance - COALESCE(SUM(borrowed.stillInPossess), 0) AS available
FROM books AS b
LEFT JOIN borrowed ON b.bookID = borrowed.bookID
WHERE b.title = ?
GROUP BY b.title, b.author, b.instance;
`;
export function countAvailableInstances(title) {
  return db
    .getConnection()
    .then((connection) => connection.query(check, [title]))
    .then((result) => {
      console.log(result[0]);
      return result[0][0].available;
    })
    .catch((err) => console.log(err));
}

export function borrowBook(username, title) {
  let userID;
  let bookID;
  return db
    .getConnection()
    .then((connection) => connection.query('SELECT userID FROM users WHERE username = ?;', [username]))
    .then((result) => {
      userID = result[0][0].userID;
      return db
        .getConnection()
        .then((connection) => connection.query('SELECT bookID FROM books WHERE title = ? LIMIT 1;', [title]));
    })
    .then((result) => {
      bookID = result[0][0].bookID;
      return db
        .getConnection()
        .then((connection) =>
          connection.query('INSERT INTO borrowed (userID, bookID, stillInPossess) VALUES (?, ?, 1);', [userID, bookID]),
        );
    })
    .catch((err) => {
      console.log(err);
    });
}

export function checkBorrowed(username, title) {
  return db.getConnection().then((connection) =>
    connection
      .query(
        `SELECT borrowed.stillInPossess 
         FROM borrowed 
         JOIN users ON borrowed.userID = users.userID 
         JOIN books ON borrowed.bookID = books.bookID 
         WHERE users.username = ? AND books.title = ? 
         AND borrowed.stillInPossess = 1;`,
        [username, title],
      )
      .then((result) => {
        if (result[0].length > 0) {
          return true;
        }
        return false;
      })
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const updateBorrowed = `UPDATE borrowed
JOIN users ON borrowed.userID = users.userID
JOIN books ON borrowed.bookID = books.bookID
SET stillInPossess = 0
WHERE users.username = ? AND books.title = ?;
`;
export function returnBook(username, title) {
  return db.getConnection().then((connection) =>
    connection
      .query(updateBorrowed, [username, title])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const byId = 'SELECT * FROM books WHERE books.isbn = ?';
export function selectBookByID(id) {
  return db.getConnection().then((connection) =>
    connection
      .query(byId, [id])
      .then((result) => result[0][0])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const deleteQ = 'DELETE FROM borrowed WHERE borrowID = ?';
export function deleteBorrow(id) {
  return db.getConnection().then((connection) =>
    connection
      .query(deleteQ, [id])
      .then((result) => result[0])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const myHistory =
  'select books.title, borrowed.stillInPossess from borrowed join books on books.bookID = borrowed.bookID join users on users.userID = borrowed.userID where users.username = ?;';
export function selectHistory(username) {
  return db.getConnection().then((connection) =>
    connection
      .query(myHistory, [username])
      .then((result) => {
        console.log('history:');
        console.log(result);
        return result[0];
      })

      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const changeUsernameQ = 'UPDATE users set username = ? WHERE username = ?';
export function changeUsername(newUsername, username) {
  return db.getConnection().then((connection) =>
    connection
      .query(changeUsernameQ, [newUsername, username])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const changePasswordQ = 'UPDATE users set hashedPassword = ? WHERE username = ?';
export function changePassword(newPassword, username) {
  return db.getConnection().then((connection) =>
    connection
      .query(changePasswordQ, [newPassword, username])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}

const changeRightsQ = 'UPDATE users set role = ? where username = ?';
export function changeRights(role, username) {
  return db.getConnection().then((connection) =>
    connection
      .query(changeRightsQ, [role, username])
      .catch((err) => console.log(err))
      .finally(() => {
        connection.release();
      }),
  );
}
