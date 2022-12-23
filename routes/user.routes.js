const express = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/authMiddleware');
const userRouter = express.Router();
userRouter.get('/current-user', userController.getCurrentUser);
userRouter.get('/', userController.getAllUser);
userRouter.put('/edit/:id', userController.updateUser);
userRouter.delete('/:id', requireAuth, userController.deleteUser);
module.exports = userRouter;
