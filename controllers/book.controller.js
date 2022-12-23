const pagination = require('../services/pagination');
const { Sequelize } = require('sequelize');
const db = require('../models');
const { QueryTypes, Op } = require('sequelize');
const {
  getBooksPagination,
  getBookById,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  filterBook,
} = require('../services/book.service');

const bookController = {
  getAllBooksPagination: async (req, res) => {
    let page;
    if (req.query && req.query.page) {
      page = Number(req.query.page);
    }
    const { totalPage, result } = await pagination(db.Book, {}, page, 20);
    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get all books success',
      length: result.rows.length,
    });
  },
  getAllBooks: async (req, res) => {
    const result = await getAllBooks();
    res.status(200).json({
      data: result,
      message: 'get all books success',
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
        order: [['createdAt', 'DESC']],
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

  getNewReleaseBooksChapter: async (req, res) => {
    let page;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    const { totalPage, result } = await pagination(
      db.Chap,
      {
        include: [{ model: db.Book }],
        distinct: true,
        group: ['bookId'],
        order: [[Sequelize.fn('max', Sequelize.col('Chap.createdAt')), 'DESC']],
      },
      page
    );
    const newestChapListReq = result.rows.map(async (item) => {
      return await db.Chap.findOne({
        where: {
          bookId: item.bookId,
        },
        order: [['createdAt', 'DESC']],
        limit: 1,
      });
    });
    const newestChapList = await Promise.all(newestChapListReq);
    const newestChapListResult = result.rows.map((item) => {
      const matchedBook = newestChapList.find((newestChap) => {
        return newestChap.bookId === item.bookId;
      });
      if (matchedBook) {
        return { ...item.toJSON(), chapName: matchedBook.chapName };
      }
    });

    res.status(200).json({
      data: newestChapListResult,
      totalPage,
      message: 'get new release books chapter success',
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
      { include: [{ model: db.Author, model: db.Chap }], order: [['viewCount', 'DESC']] },
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
      'SELECT Books.*, count(Chaps.id) as chapTotal FROM Books join Chaps on Chaps.bookId = Books.id group by Books.id order by Books.voteCount desc'
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
  createBook: async (req, res) => {
    try {
      await createBook(req.body);
      res.status(200).json({ message: 'create success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'create fail', error: error.toString() });
    }
  },
  updateBook: async (req, res) => {
    try {
      const result = await updateBook(req.params.id, req.body);
      res.status(200).json({ message: 'update success', success: true, data: result });
    } catch (error) {
      res.status(402).json({ message: 'update fail', error });
    }
  },
  deleteBook: async (req, res) => {
    try {
      await deleteBook(req.params.id);
      res.status(200).json({ message: 'delete success', success: true });
    } catch (error) {
      res.status(402).json({ message: 'delete fail', error });
    }
  },
  filterBook: async (req, res) => {
    let page;
    if (req.query && req.query.p) {
      page = Number(req.query.p);
    }
    try {
      const { totalPage, result } = await filterBook(req.body, page);
      res
        .status(200)
        .json({ message: 'get book by filter success', totalPage, data: result, success: true });
    } catch (error) {
      res.status(402).json({ message: 'get book by filter fail', error });
    }
  },
  searchBook: async (req, res) => {
    let searchBook = `%${req.query.name}%`;
    const { totalPage, result } = await pagination(db.Book, {
      where: {
        name: {
          [Op.like]: searchBook,
        },
      },
    });
    res.status(200).json({
      data: result.rows,
      totalPage,
      message: 'get books success',
      success: true,
      length: result.rows.length,
    });
  },
};
module.exports = bookController;
