const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      debug(req.body);
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'library';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected...');

          const db = client.db(dbName);
          const collection = db.collection('users');
          const user = { username, password };
          const result = await collection.insertOne(user);
          debug(result);
          req.login(result.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (error) {
          debug(error);
        }
        client.close();
      }());
    });
  authRouter.route('/signIn')
    .get((req, res) => {
      res.render(
        'signInView',
        {
          nav,
          title: 'Sign In',
        },
      );
    })
    .post(passport.authenticate(
      'local',
      {
        successRedirect: '/auth/profile',
        failureRedirect: '/',
      },
    ));
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.sendStatus(404);
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
}

module.exports = router;
