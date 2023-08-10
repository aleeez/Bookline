import express from 'express';
import * as dml from '../database/dml.js';

const bookTrafficRouter = express.Router();

bookTrafficRouter.post('/borrowreturn', (request, response) => {
  const { username } = request.user;
  const { title } = request.body;
  const { intention } = request.body;

  const respBody = `A szerver sikeresen megkapta a következő információt:
  Username: ${username}
  Title: ${title}
  Intention: ${intention}
    `;

  const validUserName = /^[a-zA-Z0-9]*$/.test(username);
  const validTitle = /^[a-zA-Z0-9\s]+$/.test(title);
  const validIntention = intention !== undefined;

  let message = '';
  let status = '';
  let myTitle = '';

  if (!validUserName || !validTitle || !validIntention) {
    myTitle = 'Error';
    status = '404';
    message = 'Invalid data';
    response.render('response', { myTitle, message, status });
  } else {
    console.log(respBody);
    // sikeres - e a kolcsonzes
    dml
      .checkBookExists(title)
      .then((bookExists) => {
        if (bookExists) {
          console.log('The book exists in the database.');
          if (intention === 'borrow') {
            console.log('alright');
            dml
              .countAvailableInstances(title)
              .then((count) => {
                console.log(`There are ${count} instances available.`);
                if (count > 0) {
                  dml.borrowBook(username, title).then(() => {
                    message = 'The borrow was successful!';
                    status = '200 OK';
                    myTitle = 'Acknowledgement';
                    response.render('response', { myTitle, message, status });
                  });
                } else {
                  message = 'We ran out of this book!';
                  status = '404 Not Found';
                  myTitle = 'Error';
                  response.render('response', { myTitle, message, status });
                }
              })
              .catch((err) => {
                console.log(err);
                throw err;
              });
          } else {
            dml
              .checkBorrowed(username, title)
              .then((borrowed) => {
                console.log(username);
                console.log(title);
                console.log(borrowed);
                if (borrowed) {
                  console.log('User has borrowed the book.');
                  dml.returnBook(username, title).then((result) => {
                    console.log(result);
                    message = 'The return was successful!';
                    status = '200 OK';
                    myTitle = 'Acknowledgement';
                    response.render('response', { myTitle, message, status });
                  });
                } else {
                  console.log('User has not borrowed the book.');
                  message = "This user doesn't own this book!";
                  status = '404 Not Found';
                  myTitle = 'Error';
                  response.render('response', { myTitle, message, status });
                }
              })
              .catch((err) => console.log(err));
          }
        } else {
          console.log('The book does not exist in the database.');
          message = "This book doesn't exists in the library!";
          status = '404 Not Found';
          myTitle = 'Error';
          response.render('response', { myTitle, message, status });
        }
      })
      .catch((err) => console.log(err));
  }
});

export default bookTrafficRouter;
