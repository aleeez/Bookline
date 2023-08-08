import express from 'express';
import { allUsers } from '../database/dml.js';

const manageUsersRouter = express.Router();

manageUsersRouter.get('/manageusers-display', (request, response) => {
  allUsers().then((users) => {
    console.log(users);
    response.render('manageusers', { users });
  });
});

export default manageUsersRouter;
