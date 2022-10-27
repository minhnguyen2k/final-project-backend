const express = require('express');
const bookController = require('../controller/book');
const bookRouter = express.Router();
bookRouter.get('/', bookController.getHomePage);
module.exports = bookRouter;
