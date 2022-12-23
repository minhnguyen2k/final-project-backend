const express = require('express');
const chapController = require('../controllers/chap.controller');
const { requireAuth } = require('../middleware/authMiddleware');
const chapRouter = express.Router();
chapRouter.get('/', chapController.getAllChaps);
chapRouter.post('/', chapController.createChap);
chapRouter.put('/edit/:id', chapController.updateChap);
chapRouter.delete('/:id', requireAuth, chapController.deleteChap);
module.exports = chapRouter;
