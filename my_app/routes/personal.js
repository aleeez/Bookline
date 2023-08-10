import express from 'express';
import bookTrafficRouter from './booktraffic.js';

const personalRouter = express.Router();

personalRouter.get('/personal', (request, response) => {
  const { username } = request.user;
  response.render('personal', { username });
});

personalRouter.use('/bookhandling', bookTrafficRouter);

export default personalRouter;
