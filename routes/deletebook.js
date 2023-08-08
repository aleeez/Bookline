import express from 'express';
import { checkISBNExists, deleteBook } from '../database/dml.js';

const deleteBookRouter = express.Router();

deleteBookRouter.get('/deletebook-display', (reques, response) => {
  response.render('deletebook');
});

deleteBookRouter.post('/deletebook-form', (request, response) => {
  const { isbn } = request.body;
  checkISBNExists(isbn).then((exists) => {
    console.log('exists: ', exists);
    if (!exists) {
      const message = 'There is no book with this ISBN!';
      const status = '404 Not Found';
      const myTitle = 'Error';
      response.render('response', { myTitle, message, status });
      return;
    }
    deleteBook(isbn)
      .then(() => {
        const message = 'The delete was successful!';
        const status = '200 OK';
        const myTitle = 'Acknowledgement';
        response.render('response', { myTitle, message, status });
      })
      .catch((err) => {
        console.log(err);
        const message = 'The delete failed!';
        const status = '500 Internal Server Error';
        const myTitle = 'Error';
        response.render('response', { myTitle, message, status });
      });
  });
});

export default deleteBookRouter;
