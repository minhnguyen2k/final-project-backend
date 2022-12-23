const express = require('express');
const roleController = require('../controllers/role.controller');
const roleRouter = express.Router();
roleRouter.get('/', roleController.getAllRoles);
module.exports = roleRouter;
