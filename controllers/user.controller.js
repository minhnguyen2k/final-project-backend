const db = require('../models');
const { handleAuth } = require('../services/handle-error.service');
const { getAllUsers, updateUser, deleteUser } = require('../services/user.service');
const userController = {
  getCurrentUser: (req, res) => {
    if (res.currUser) {
      res.status(200).json({ user: res.currUser });
    }
  },
  getAllUser: async (req, res) => {
    try {
      const result = await getAllUsers();
      res.status(200).json({ data: result, message: 'get all users', success: true });
    } catch (error) {
      res.status(402).json({ message: 'get all users fail', error });
    }
  },
  updateUser: async (req, res) => {
    try {
      const result = await updateUser(req.params.id, req.body);
      res.status(200).json({ message: 'update success', success: true, data: result });
    } catch (error) {
      res.status(402).json({ message: 'update fail', error });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await deleteUser(req.params.id);
      res.status(200).json({ message: 'delete success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'delete fail', error });
    }
  },
};
module.exports = userController;
