import express from 'express';
import path from 'path';
import { insertBook } from '../database/dml.js';

const insertBookRouter = express.Router();

insertBookRouter.get('/insertbook-display', (reques, response) => {
  response.render('insertbook');
});

insertBookRouter.post('/insertbook-form', (request, response) => {
  const picturePath = request.files.picture.path;
  const pictureName = path.basename(picturePath);

  const book = {
    isbn: request.fields.isbn,
    title: request.fields.title,
    author: request.fields.author,
    year: request.fields.year,
    description: request.fields.description,
    instance: request.fields.instance,
    picture: pictureName,
  };

  const respBody = `A szerver sikeresen megkapta a következő információt: ${book}`;
  console.log(respBody);
  insertBook(book)
    .then(() => {
      console.log(book);
      response.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      const message = 'The insert failed!';
      const status = '500 Internal Server Error';
      const myTitle = 'Error';
      response.render('response', { myTitle, message, status });
    });
});

export default insertBookRouter;
