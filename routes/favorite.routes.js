const express = require('express');
const favoriteController = require('../controllers/favorite.controller');
const { requireAuth } = require('../middleware/authMiddleware');
const favoriteRouter = express.Router();
favoriteRouter.get('/:userId', requireAuth, favoriteController.getAllFavoriteBooksByUser);
favoriteRouter.post('/check-current-book', requireAuth, favoriteController.checkBookIsFavorited);
favoriteRouter.post('/', requireAuth, favoriteController.createFavorite);
favoriteRouter.delete('/', requireAuth, favoriteController.deleteFavorite);

module.exports = favoriteRouter;
