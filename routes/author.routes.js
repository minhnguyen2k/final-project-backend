const express = require('express');
const authorController = require('../controllers/author.controller');
const authorRouter = express.Router();
authorRouter.get('/', authorController.getAllAuthors);
module.exports = authorRouter;
