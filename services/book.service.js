const { QueryTypes, Op } = require('sequelize');
const { Sequelize } = require('../models');
const db = require('../models');

const getBooksPagination = async (page = 1, query, limit = 10) => {
  const offset = (page - 1) * limit;
  const countBook = await db.sequelize.query('SELECT count(id) as totalBook from Books', {
    type: QueryTypes.SELECT,
  });
  const totalPage = Math.ceil(countBook[0].totalBook / limit);
  const result = await db.sequelize.query(`${query} limit ${limit} offset ${offset}`, {
    type: QueryTypes.SELECT,
  });
  return { totalPage, result };
};
const getAllBooks = async () => {
  const result = await db.Book.findAll({
    include: [
      { model: db.Author, attributes: ['id', 'name'], through: { attributes: [] } },
      { model: db.Genre, attributes: ['id', 'name'], through: { attributes: [] } },
    ],
  });
  return result;
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
    group: ['Chap.bookId'],
  });
  return { book, relevantBooks, totalRelevantBooksChap };
};
const createBook = async (data) => {
  const book = await db.Book.findOne({ where: { name: data.name } });
  if (book) {
    throw Error('Book name is already exists');
  }
  const result = await db.Book.create({
    name: data.name,
    description: data.description,
    image: data.image,
    viewCount: data.viewCount,
    voteCount: data.voteCount,
  });
  for (let i = 0; i < data.Authors.length; i++) {
    await db.BookAuthor.create({ authorId: data.Authors[i].id, bookId: result.id });
  }
  for (let j = 0; j < data.Genres.length; j++) {
    await db.BookGenre.create({ genreId: data.Genres[j].id, bookId: result.id });
  }
};
const updateBook = async (id, data) => {
  let book = await db.Book.findOne({
    where: { id },
    include: [{ model: db.Author }, { model: db.Genre }],
  });
  if (book) {
    book.name = data.name;
    book.description = data.description;
    book.image = data.image;
    book.viewCount = data.viewCount;
    book.voteCount = data.voteCount;
    await book.save();
    const newAuthorList = data.Authors.filter((authorReq) => {
      return !book.Authors.some((author) => {
        return author.id === authorReq.id;
      });
    });
    const oldAuthorList = JSON.parse(
      JSON.stringify(
        book.Authors.filter((author) => {
          return !data.Authors.some((authorReq) => {
            return authorReq.id === author.id;
          });
        })
      )
    );

    const newGenreList = data.Genres.filter((genreReq) => {
      return !book.Genres.some((genre) => {
        return genre.id === genreReq.id;
      });
    });
    const oldGenreList = book.Genres.filter((genre) => {
      return !data.Genres.some((genreReq) => {
        return genreReq.id === genre.id;
      });
    });

    if (newAuthorList.length > 0) {
      for (let i = 0; i < newAuthorList.length; i++) {
        await db.BookAuthor.create({ authorId: newAuthorList[i].id, bookId: book.id });
      }
    }
    if (oldAuthorList.length > 0) {
      for (let j = 0; j < oldAuthorList.length; j++) {
        await db.BookAuthor.destroy({ where: { authorId: oldAuthorList[j].id, bookId: book.id } });
      }
    }

    if (newGenreList.length > 0) {
      for (let m = 0; m < newGenreList.length; m++) {
        await db.BookGenre.create({ genreId: newGenreList[m].id, bookId: book.id });
      }
    }
    if (oldGenreList.length > 0) {
      for (let n = 0; n < oldGenreList.length; n++) {
        await db.BookGenre.destroy({ where: { genreId: oldGenreList[n].id, bookId: book.id } });
      }
    }
    const result = await db.Book.findOne({
      where: { id },
      include: [{ model: db.Author }, { model: db.Genre }],
    });
    return result;
  }
};
const deleteBook = async (id) => {
  await db.Book.destroy({
    where: { id },
  });
};
const filterBook = async (data, page = 1) => {
  const offset = (page - 1) * 30;
  let option = '';
  if (data.genreId) {
    option += ` where Book_Genre.genreId = '${data.genreId}'`;
  }
  if (typeof data.chapCount === 'number') {
    if (data.chapCount === 0) {
      option += ` group by Books.id having chapTotal > 0`;
    } else {
      option += ` group by Books.id having chapTotal>=${data.chapCount}`;
    }
  }
  if (data.sortBy) {
    if (data.sortBy === 'newChapter') {
      option += ` order by Chaps.createdAt desc`;
    } else if (data.sortBy === 'newBook') {
      option += ` order by Books.createdAt desc`;
    } else if (data.sortBy === 'mostViewed') {
      option += ' order by Books.viewCount desc';
    } else option += ' order by chapTotal desc';
  }
  console.log(option);
  const result = await db.sequelize.query(
    `SELECT Books.*,count(Chaps.id) as chapTotal FROM Books ${
      data.genreId ? 'join Book_Genre on Books.id=Book_Genre.bookId' : ''
    } join Chaps on Chaps.bookId = Books.id ${
      option === '' ? 'group by Books.id' : option
    } limit 30 offset ${offset}`,
    {
      type: QueryTypes.SELECT,
    }
  );
  const totalPage = Math.ceil(result.length / 30);
  return { totalPage, result };
};

module.exports = {
  getBooksPagination,
  getBookById,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  filterBook,
};
