const pagination = require('../services/pagination');
const db = require('../models');
const { Sequelize } = require('../models');
const { getBooksPagination, getBookById } = require('../services/book.service');

const bookController = {
  getAllBooksPagination: async (req, res) => {
    let page;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    const { totalPage, result } = await pagination(db.Book, {}, page, 30);
    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get all books success',
      length: result.rows.length,
    });
  },
  getNewReleaseBooks: async (req, res) => {
    let page;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    const { totalPage, result } = await pagination(
      db.Book,
      {
        include: [{ model: db.Author }],
        distinct: true,
        order: [['createdAt', 'ASC']],
      },
      page
    );
    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get new release books success',
      length: result.rows.length,
    });
  },

  getPopularBooks: async (req, res) => {
    let page;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    const { totalPage, result } = await pagination(
      db.Book,
      { include: [{ model: db.Author }], order: [['viewCount', 'DESC']] },
      page
    );

    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get popular books success',
      length: result.rows.length,
    });
  },

  getTopBooks: async (req, res) => {
    let page;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    const { totalPage, result } = await getBooksPagination(
      page,
      'SELECT books.*, count(chaps.id) as chapTotal FROM books join chaps on chaps.bookId = books.id group by books.id order by books.voteCount desc'
    );
    const books = await pagination(
      db.Book,
      {
        include: [{ model: db.Author }],

        order: [['voteCount', 'DESC']],
      },
      page
    );

    res.status(200).json({
      data: { books: books.result.rows, chapTotal: result },
      totalPage,
      message: 'get top books success',
    });
  },

  getActionGenreBooks: async (req, res) => {
    let page;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    const { totalPage, result } = await pagination(
      db.Book,
      {
        include: [{ model: db.Genre, attributes: [], where: { name: 'Action' } }],
      },
      page
    );

    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get action books success',
      length: result.rows.length,
    });
  },

  getBookById: async (req, res) => {
    const id = req.params.id;
    const { book, relevantBooks, totalRelevantBooksChap } = await getBookById(id);

    res.status(200).json({
      data: { book, relevantBooks, totalRelevantBooksChap },
      message: 'get books by id success',
    });
  },

  getBooksByGenre: async (req, res) => {
    let page;
    let genre;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    if (req.query && req.query.genre) {
      genre = req.query.genre;
    }
    const result = await pagination(
      db.Genre,
      { where: { id: genre }, include: [{ model: db.Book }] },
      page
    );
    res.status(200).json({
      data: result.rows,
      message: 'get books by genre success',
      length: result.rows.length,
    });
  },
};
module.exports = bookController;
