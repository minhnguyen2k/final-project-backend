const express = require('express');
const chapImageController = require('../controllers/chap-image.controller');
const chapImageRouter = express.Router();
chapImageRouter.get('/:chapId', chapImageController.getAllChapImage);
module.exports = chapImageRouter;
