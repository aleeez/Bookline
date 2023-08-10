import express from 'express';

const logoutRouter = express.Router();

logoutRouter.use('/delete-session', (request, response) => {
  request.logout((err) => {
    if (err) {
      console.error(err);
      response.redirect('/');
    }
    response.redirect('/');
  });
});

export default logoutRouter;
