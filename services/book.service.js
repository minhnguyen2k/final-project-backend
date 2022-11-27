const { QueryTypes, Op } = require('sequelize');
const { Sequelize } = require('../models');
const db = require('../models');

const getBooksPagination = async (page = 1, query, limit = 10) => {
  const offset = (page - 1) * limit;
  const countBook = await db.sequelize.query('SELECT count(id) as totalBook from books', {
    type: QueryTypes.SELECT,
  });
  const totalPage = Math.ceil(countBook[0].totalBook / limit);
  const result = await db.sequelize.query(`${query} limit ${limit} offset ${offset}`, {
    type: QueryTypes.SELECT,
  });
  return { totalPage, result };
};

const getBookById = async (id) => {
  const book = await db.Book.findOne({
    where: { id },
    include: [{ model: db.Author }, { model: db.Chap }, { model: db.Genre }],
  });
  const bookGenre = book.dataValues.Genres.map((genres) => genres.name);
  const relevantBooks = await db.Book.findAll({
    order: Sequelize.literal('rand()'),
    limit: 4,
    include: [
      {
        model: db.Genre,
        where: {
          name: {
            [Op.in]: bookGenre,
          },
        },
      },
    ],
  });
  const relevantBookIds = relevantBooks.map((data) => data.id);
  const totalRelevantBooksChap = await db.Chap.count({
    where: {
      bookId: {
        [Op.or]: relevantBookIds,
      },
    },
    group: ['chap.bookId'],
  });
  return { book, relevantBooks, totalRelevantBooksChap };
};
module.exports = {
  getBooksPagination,
  getBookById,
};
