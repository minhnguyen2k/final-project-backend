const db = require('../models');
const { createComment } = require('../services/comment.service');
const {
  createFavorite,
  checkBookIsFavorited,
  deleteFavorite,
} = require('../services/favorite.service');
const pagination = require('../services/pagination');

const favoriteController = {
  getAllFavoriteBooksByUser: async (req, res) => {
    let page;
    let userId;
    if (req.query && req.query.page) {
      page = Number(req.query.page);
    }
    if (req.params && req.params.userId) {
      userId = req.params.userId;
    }
    const { totalPage, result } = await pagination(
      db.Favorite,
      { where: { userId }, include: [{ model: db.Book }] },
      page,
      20
    );
    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get all favorite books by user success',
      success: true,
    });
  },
  createFavorite: async (req, res) => {
    try {
      await createFavorite(req.body, res.currUser.id);
      res.status(200).json({ message: 'create success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'create fail', error });
    }
  },
  checkBookIsFavorited: async (req, res) => {
    try {
      const isFavorited = await checkBookIsFavorited(req.body, res.currUser.id);
      res.status(200).json({ message: 'create success', success: isFavorited });
    } catch (error) {
      res.status(402).json({ message: 'create fail', error });
    }
  },
  deleteFavorite: async (req, res) => {
    try {
      await deleteFavorite(req.body, res.currUser.id);
      res.status(200).json({ message: 'delete success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'delete fail', error });
    }
  },
};
module.exports = favoriteController;
