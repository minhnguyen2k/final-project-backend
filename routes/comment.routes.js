const express = require('express');
const commentController = require('../controllers/comment.controller');
const { requireAuth } = require('../middleware/authMiddleware');
const commentRouter = express.Router();
commentRouter.get('/:bookId', commentController.getAllCommentsByBook);
commentRouter.post('/', requireAuth, commentController.createComment);

module.exports = commentRouter;
