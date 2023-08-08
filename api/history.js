import express from 'express';
import * as dml from '../database/dml.js';

const historyRouter = express.Router();

historyRouter.get('/:username', (request, response) => {
  const { username } = request.params;
  console.log('Endpoint reached!: ', username);
  dml
    .selectHistory(username)
    .then((borrows) => {
      console.log(borrows);
      response.send(borrows);
    })
    .catch((error) => {
      console.error('Error deleting borrow:', error);
      response.status(500).json({ error: 'Error deleting borrow' });
    });
});

export default historyRouter;
