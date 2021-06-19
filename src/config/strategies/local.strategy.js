const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');

function localStrategy(passport) {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password',
  }, (username, password, done) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'library';

    (async function query() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected...');

        const db = client.db(dbName);
        const collection = db.collection('users');

        const user = await collection.findOne({ username });

        if (user.password === password) {
          done(null, user);
        } else {
          done(null);
        }
      } catch (error) {
        debug(error.stack);
      }
      client.close();
    }());
  }));
}

module.exports = localStrategy;
