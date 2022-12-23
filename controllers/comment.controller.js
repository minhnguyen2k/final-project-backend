const db = require('../models');
const { createComment } = require('../services/comment.service');
const pagination = require('../services/pagination');

const commentController = {
  getAllCommentsByBook: async (req, res) => {
    let page;
    let bookId;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    if (req.params && req.params.bookId) {
      bookId = req.params.bookId;
    }
    const { totalPage, result } = await pagination(
      db.Comment,
      { where: { bookId }, include: [{ model: db.User }] },
      page
    );
    res.status(200).json({
      data: result.rows,
      message: 'get all comments by book success',
      success: true,
    });
  },
  createComment: async (req, res) => {
    try {
      await createComment(req.body, res.currUser.id);
      res.status(200).json({ message: 'create success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'create fail', error });
    }
  },
};
module.exports = commentController;
