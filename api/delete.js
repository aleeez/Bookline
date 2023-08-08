import express from 'express';
import * as dml from '../database/dml.js';

const deleteRouter = express.Router();

deleteRouter.get('/:id', (request, response) => {
  const borrowId = request.params.id;
  console.log('Endpoint reached!: ', borrowId);
  dml
    .deleteBorrow(borrowId)
    .then((borrows) => {
      console.log(borrows);
      response.send(borrows);
    })
    .catch((error) => {
      console.error('Error deleting borrow:', error);
      response.status(500).json({ error: 'Error deleting borrow' });
    });
});

export default deleteRouter;
