import express from 'express';
import * as dml from '../database/dml.js';

const userRouter = express.Router();

userRouter.post('/filterrr', (request, response) => {
  const { title } = request.body;
  const { author } = request.body;
  const { minyear } = request.body;
  const { maxyear } = request.body;
  const { rarity } = request.body;
  console.log(request.body);
  console.log('userRouter');
  dml.selectFilteredBooks(request.body).then((books) => {
    console.log(books);
    response.redirect(`/?title=${title}&author=${author}&minyear=${minyear}&maxyear=${maxyear}&rarity=${rarity}`);
  });
});

export default userRouter;
