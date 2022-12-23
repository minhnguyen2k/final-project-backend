const db = require('../models');
const {
  getAllChapImage,
  createChapImage,
  updateChapImage,
  deleteChapImage,
} = require('../services/chap-image.service');
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
  createChapImage: async (req, res) => {
    try {
      await createChapImage(req.body);
      res.status(200).json({ message: 'create success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'create fail', error });
    }
  },
  updateChapImage: async (req, res) => {
    try {
      const result = await updateChapImage(req.params.id, req.body);
      res.status(200).json({ message: 'update success', success: true, data: result });
    } catch (error) {
      res.status(402).json({ message: 'update fail', error });
    }
  },
  deleteChapImage: async (req, res) => {
    try {
      await deleteChapImage(req.params.id);
      res.status(200).json({ message: 'delete success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'delete fail', error });
    }
  },
};
module.exports = chapImageController;
