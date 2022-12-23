const db = require('../models');
const { getAllChaps, createChap, updateChap, deleteChap } = require('../services/chap.service');
const chapController = {
  getAllChaps: async (req, res) => {
    const bookId = req.query.book_id;
    const result = await getAllChaps(bookId);
    res.status(200).json({ data: result, message: 'get all chaps success' });
  },
  createChap: async (req, res) => {
    try {
      await createChap(req.body);
      res.status(200).json({ message: 'create success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'create fail', error });
    }
  },
  updateChap: async (req, res) => {
    try {
      const result = await updateChap(req.params.id, req.body);
      res.status(200).json({ message: 'update success', success: true, data: result });
    } catch (error) {
      res.status(402).json({ message: 'update fail', error });
    }
  },
  deleteChap: async (req, res) => {
    try {
      await deleteChap(req.params.id);
      res.status(200).json({ message: 'delete success', success: true });
    } catch (error) {
      if (error.error.message.includes(`Can't find folder with path`)) {
        res.status(402).json({ message: 'delete fail', error, success: true });
        return;
      }
      res.status(402).json({ message: 'delete fail', error });
    }
  },
};
module.exports = chapController;
