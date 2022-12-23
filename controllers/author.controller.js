const db = require('../models');
const { getAllAuthors } = require('../services/author.service');
const authorController = {
  getAllAuthors: async (req, res) => {
    const result = await getAllAuthors();
    res.status(200).json({ data: result, message: 'get all authors success' });
  },
};
module.exports = authorController;
