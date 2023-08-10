import express from 'express';
import personalRouter from './personal.js';
import accountRouter from './account.js';
import adminRightsRouter from './adminrights.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/dashboard-display', (req, res) => {
  res.render('dashboard');
});

dashboardRouter.use('/bookshelf', personalRouter);

dashboardRouter.use('/myaccount', accountRouter);

const adminsOnly = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    next();
  } else {
    const myTitle = 'Error';
    const status = '401 Unauthorized';
    const message = 'This area is for admin only';
    res.render('response', { myTitle, message, status });
  }
};

dashboardRouter.use('/adminrights', adminsOnly, adminRightsRouter);

export default dashboardRouter;
