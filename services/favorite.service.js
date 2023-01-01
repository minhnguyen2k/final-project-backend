const db = require('../models');

const getAllFavoriteBooksByUser = async (userId) => {
  const result = await db.Favorite.findAll({ userId });
  return result;
};

const createFavorite = async (data, userId) => {
  await db.Favorite.create({
    bookId: data.bookId,
    userId: userId,
  });
};

const checkBookIsFavorited = async (data, userId) => {
  const isFavorited = await db.Favorite.findOne({
    where: { bookId: data.bookId, userId },
  });
  if (isFavorited) {
    return true;
  }
  return false;
};

const deleteFavorite = async (data, userId) => {
  await db.Favorite.destroy({
    where: { bookId: data.bookId, userId },
  });
};

module.exports = {
  getAllFavoriteBooksByUser,
  createFavorite,
  checkBookIsFavorited,
  deleteFavorite,
};
