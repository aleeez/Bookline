import express from 'express';
import bcrypt from 'bcrypt';
import * as dml from '../database/dml.js';

const registerRouter = express.Router();

let message = '';
let status = '';
let myTitle = '';
registerRouter.post('/createHash', (request, response) => {
  const { fname } = request.body;
  const { lname } = request.body;
  const { username } = request.body;
  const { password } = request.body;
  const { password2 } = request.body;
  console.log('create hash');
  console.log(username, password, password2);
  if (password !== password2) {
    message = "Passwords don't match!";
    status = '400 Bad request';
    myTitle = 'Error';
    response.render('response', { myTitle, message, status });
    return;
  }
  dml.checkUserExists(username).then((exists) => {
    if (!exists) {
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const newUser = {
            fname,
            lname,
            username,
            hashedPassword,
          };
          dml.insertUser(newUser);
          response.redirect('/');
        })
        .catch((err) => console.log(err));
    } else {
      message = 'This user already exists!';
      status = '401 Unauthorized';
      myTitle = 'Error';
      response.render('response', { myTitle, message, status });
    }
  });
});

export default registerRouter;
