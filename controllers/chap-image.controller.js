const db = require('../models');
const { getAllChapImage } = require('../services/chap-image.service');
const pagination = require('../services/pagination');

const chapImageController = {
  getAllChapImage: async (req, res) => {
    const chapId = req.params.chapId;
    const result = await getAllChapImage(chapId);
    res.status(200).json({
      data: result,
      message: 'get all chap Images success',
    });
  },
};
module.exports = chapImageController;
