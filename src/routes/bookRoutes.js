const express = require('express');
const bookController = require('../controllers/bookController');
const bookServices = require('../services/bookService');

const bookRouter = express.Router();

function router(nav) {
  const { getBook, getBookList, allowUsertoBooksRoute } = bookController(nav, bookServices);

  bookRouter.use(allowUsertoBooksRoute);

  bookRouter.route('/')
    .get(getBookList);

  bookRouter.route('/:id')
    .get(getBook);
  return bookRouter;
}

module.exports = router;
