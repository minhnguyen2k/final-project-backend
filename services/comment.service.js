const db = require('../models');

const getAllCommentsByBook = async (bookId) => {
  const result = await db.Comment.findAll({ bookId });
  return result;
};

const createComment = async (data, userId) => {
  await db.Comment.create({
    bookId: data.bookId,
    userId: userId,
    content: data.content,
  });
};

module.exports = {
  getAllCommentsByBook,
  createComment,
};
