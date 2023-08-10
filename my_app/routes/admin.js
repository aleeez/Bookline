import express from 'express';
import path from 'path';
import * as dml from '../database/dml.js';

const adminRouter = express.Router();

adminRouter.post('/admin', (request, response) => {
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
  dml
    .insertBook(book)
    .then(() => {
      console.log(book);
      response.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      const message = 'The insert failed!';
      const status = '500 Internal Server Error';
      const metaData = "<head><link rel='stylesheet' type='text/css' media='screen' href='public/forms.css'></head>";
      const htmlResponse = `<html>${metaData}<body><h1>${message}</h1><h2>${status}</h2></body></html>`;
      response.status(500).send(htmlResponse);
    });
});

export default adminRouter;
