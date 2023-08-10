import express from 'express';
import bcrypt from 'bcrypt';
import { selectUser, getUser, changeUsername, changePassword } from '../database/dml.js';

const accountRouter = express.Router();

accountRouter.get('/myaccount-display', (request, response) => {
  const { username } = request.user;
  selectUser(username).then((user) => {
    console.log(user);
    response.render('account', { user });
  });
});

const checkValidPassword = (request, response, next) => {
  const { username } = request.user;
  getUser(username).then((validUser) => {
    bcrypt.compare(request.body.password, validUser.hashedPassword).then((match) => {
      if (match) {
        next();
      } else {
        const message = 'Wrong password given!';
        const status = '401 Unauthorized';
        const myTitle = 'Error';
        response.render('response', { myTitle, message, status });
      }
    });
  });
};

accountRouter.post('/changeusername', checkValidPassword, (request, response) => {
  const { username } = request.user;
  const newUsername = request.body.newusername;
  changeUsername(newUsername, username).then(() => response.redirect('/login/login-form'));
});

accountRouter.post('/changepassword', checkValidPassword, (request, response) => {
  const { username } = request.user;
  const newPassword = request.body.password2;
  bcrypt
    .hash(newPassword, 10)
    .then((hashedPassword) =>
      changePassword(hashedPassword, username).then(() => response.redirect('/login/login-form')),
    );
});

export default accountRouter;
