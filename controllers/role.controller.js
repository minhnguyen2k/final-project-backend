const db = require('../models');
const { getAllRoles } = require('../services/role.service');

const roleController = {
  getAllRoles: async (req, res) => {
    try {
      const result = await getAllRoles();
      res.status(200).json({ data: result, message: 'get all roles', success: true });
    } catch (error) {
      res.status(402).json({ message: 'get all roles fail', error });
    }
  },
};
module.exports = roleController;
