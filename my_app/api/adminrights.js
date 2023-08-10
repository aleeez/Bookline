import express from 'express';
import { changeRights } from '../database/dml.js';

const adminRightsRouter = express.Router();

adminRightsRouter.use('/:id/:role', (request, response) => {
  const username = request.params.id;
  const { role } = request.params;
  console.log('Endpoint reached!: ', username, role);
  changeRights(role, username)
    .then(() => {
      response.send({ message: 'ok' });
    })
    .catch((error) => {
      console.error('Error deleting borrow:', error);
      response.status(500).json({ error: 'Error updating user' });
    });
});

export default adminRightsRouter;
