const db = require('../models');
const { getAllGenres } = require('../services/genre.service');
const pagination = require('../services/pagination');

const genreController = {
  getAllGenres: async (req, res) => {
    const result = await getAllGenres();
    res.status(200).json({
      data: result,
      message: 'get all books success',
    });
  },
  getGenreById: async (req, res) => {
    let page;
    let id;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    if (req.params && req.params.id) {
      id = req.params.id;
    }
    const { totalPage, result } = await pagination(
      db.Genre,
      { where: { id }, include: [{ model: db.Book }] },
      page
    );
    res.status(200).json({
      data: result.rows,
      message: 'get books by genre success',
    });
  },
};
module.exports = genreController;