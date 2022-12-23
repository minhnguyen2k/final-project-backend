const express = require('express');
const chapImageController = require('../controllers/chap-image.controller');
const { requireAuth } = require('../middleware/authMiddleware');
const chapImageRouter = express.Router();
chapImageRouter.get('/:chapId', chapImageController.getAllChapImage);
chapImageRouter.post('/', chapImageController.createChapImage);
chapImageRouter.put('/edit/:id', chapImageController.updateChapImage);
chapImageRouter.delete('/:id', requireAuth, chapImageController.deleteChapImage);
module.exports = chapImageRouter;
