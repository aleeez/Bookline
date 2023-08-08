import express from 'express';
import * as dml from '../database/dml.js';

const descriptionRouter = express.Router();

descriptionRouter.get('/:id', (request, response) => {
  const bookId = request.params.id;
  console.log('Endpoint reached!: ', bookId);

  dml
    .selectBookByID(bookId)
    .then((books) => {
      console.log(books);
      if (books.length === 0) {
        response.status(404).json({ error: 'Book not found' });
      } else {
        response.send(books);
      }
    })
    .catch((error) => {
      console.error('Error retrieving book details:', error);
      response.status(500).json({ error: 'Error retrieving book details' });
    });
});

export default descriptionRouter;
