const express = require('express');
const authController = require('../controllers/auth.controller');
const signCloud = require('../middleware/signCloudinary');
const authRouter = express.Router();
authRouter.post('/register', authController.signUp);
authRouter.post('/login', authController.login);
authRouter.get('/sign-cloudinary', signCloud);
module.exports = authRouter;
