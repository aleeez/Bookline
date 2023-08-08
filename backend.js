import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';
import bcrypt from 'bcrypt';
import { createAllTables } from './database/ddl.js';
import * as dml from './database/dml.js';
import userRouter from './routes/userinteraction.js';
import descriptionRouter from './api/description.js';
import deleteRouter from './api/delete.js';
import registerRouter from './routes/register.js';
import historyRouter from './api/history.js';
import loginRouter from './routes/login.js';
import logoutRouter from './routes/logout.js';
import adminRightsRouter from './api/adminrights.js';

(async function main() {
  await createAllTables();
  console.log('Tables created/altered successfully');
})();

const app = express();
app.use(cookieParser());
const staticDir = path.join(process.cwd(), 'public');
app.use('/public', express.static(staticDir));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(
  session({
    secret: 'kajdblsfSCNLndlSCNljdabask',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // Set a dynamic cookie name based on user ID
      name: (req) => `session-${req.user.id}`,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const authUser = (user, password, done) => {
  dml.getUser(user).then((userData) => {
    bcrypt.compare(password, userData.hashedPassword).then((match) => {
      if (match) {
        return done(null, userData);
      }
      return done(null, false);
    });
  });
};

passport.use(new LocalStrategy(authUser));

passport.serializeUser((userObj, done) => {
  done(null, userObj);
});

passport.deserializeUser((userObj, done) => {
  console.log('--------> Serialize User');
  done(null, userObj);
});

passport.deserializeUser((userObj, done) => {
  console.log('--------> De-Serialize User');
  done(null, userObj);
});

app.use('/register', registerRouter);

app.set('view engine', 'ejs');

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/login/dashboard/dashboard-display',
    failureRedirect: '/login/login-form',
    failureFlash: true,
  }),
);

app.use('/login', loginRouter);

app.use('/user', userRouter);

app.use('/description', descriptionRouter);

app.use('/history', historyRouter);

app.use('/adminrights', adminRightsRouter);

app.use('/delete', deleteRouter);

app.use('/logout', logoutRouter);

// ez csak a fooldalra vonatkozik
app.get('/', (request, response) => {
  const { title, author, minyear, maxyear, rarity } = request.query;
  const filterCriteria = {
    title,
    author,
    minyear,
    maxyear,
    rarity,
  };
  dml
    .selectFilteredBooks(filterCriteria)
    .then((books) => {
      response.render('homepage', { books });
    })
    .catch(() => {
      dml.selectBooks().then((books) => {
        response.render('homepage', { books });
      });
    });
});

app.listen(8080, '0.0.0.0', () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
