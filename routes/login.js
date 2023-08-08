import express from 'express';
import dashboardRouter from './dashboard.js';

const loginRouter = express.Router();

loginRouter.get('/login-form', (req, res) => {
  res.render('login');
});

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login/login-form');
  }
};

loginRouter.use('/dashboard', checkAuthenticated, dashboardRouter);

export default loginRouter;
