const db = require('../models');
const { getAllGenres } = require('../services/genre.service');
const pagination = require('../services/pagination');

const genreController = {
  getAllGenres: async (req, res) => {
    const result = await getAllGenres();
    res.status(200).json({
      data: result,
      message: 'get all genres success',
    });
  },
  getGenreById: async (req, res) => {
    let page;
    let id;
    if (req.query && req.query.page) {
      page = Number(req.query.page);
    }
    if (req.params && req.params.id) {
      id = req.params.id;
    }
    const { totalPage, result } = await pagination(
      db.Genre,
      { where: { id }, include: [{ model: db.Book }], subQuery: false },
      page,
      20
    );
    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get books by genre success',
    });
  },
};
module.exports = genreController;
