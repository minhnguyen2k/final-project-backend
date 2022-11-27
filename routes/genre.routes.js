const express = require('express');
const genreController = require('../controllers/genre.controller');
const genreRouter = express.Router();
genreRouter.get('/', genreController.getAllGenres);
genreRouter.get('/:id', genreController.getGenreById);
module.exports = genreRouter;
