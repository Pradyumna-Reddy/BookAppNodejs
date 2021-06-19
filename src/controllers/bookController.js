const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(nav, bookService) {
  function getBookList(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'library';
    let books;
    (async function query() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected...');

        const db = client.db(dbName);

        const collection = await db.collection('books');

        books = await collection.find().toArray();
      } catch (error) {
        debug(error.stack);
      }
      client.close();
      res.render(
        'books',
        {
          bookTitle: 'Libro',
          nav,
          books,
        },
      );
    }());
  }

  function getBook(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'library';
    let book;
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected...');

        const db = client.db(dbName);

        const collection = await db.collection('books');

        book = await collection.findOne({ _id: new ObjectID(id) });

        book.details = await bookService.getBookDetailsById();
      } catch (err) {
        debug(err.stack);
      }
      client.close();
      res.render(
        'book',
        {
          bookTitle: 'Libro',
          nav,
          book,
        },
      );
    }());
  }

  function allowUsertoBooksRoute(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/signIn');
    }
  }

  return {
    getBookList,
    getBook,
    allowUsertoBooksRoute,
  };
}

module.exports = bookController;
