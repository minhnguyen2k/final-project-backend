const db = require('../models');
const bcrypt = require('bcrypt');
const createToken = require('../middleware/createToken');
const { handleLogin, handleSignUp } = require('../services/auth.service');
const authController = {
  signUp: async (req, res) => {
    const data = req.body;
    try {
      await handleSignUp(data);
      res.status(200).json({ message: 'create user success', success: true });
    } catch (error) {
      res.status(400).json({ message: 'create user fail', error: error.toString() });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await handleLogin(email, password);
      const token = createToken(user.id);
      res.status(200).json({
        success: true,
        message: 'login success',
        userInfo: user,
        token: token,
      });
    } catch (error) {
      res.status(400).json({ message: 'login fail', success: false, error: error.toString() });
    }
  },
};
module.exports = authController;
