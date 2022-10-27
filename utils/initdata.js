const db = require('../models');
const fs = require('fs');
const path = require('path');
const { QueryTypes } = require('sequelize');

const toCapitalize = (string) => {
  return string
    .toLowerCase()
    .split(' ')
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ');
};
const addAuthor = async (authorName) => {
  await db.Author.create({ name: authorName });
};
const addBook = async (book) => {
  await db.Book.create({
    name: book.detail.title,
    description: book.description,
    image: book.detail.image,
    viewCount: 0,
  });
};
const initAuthor = () => {
  let author = [];
  let authorNameOrAuthorNameList;
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic')
  );
  results.forEach((file) => {
    const comic = fs.readFileSync(
      'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic\\' + file
    );
    authorNameOrAuthorNameList = JSON.parse(comic).detail.author.includes('-')
      ? JSON.parse(comic).detail.author.split(' - ')
      : JSON.parse(comic).detail.author;
    if (Array.isArray(authorNameOrAuthorNameList)) {
      if (authorNameOrAuthorNameList.length === 1) {
        authorNameOrAuthorNameList = authorNameOrAuthorNameList.toString().slice(0, -2);
        author.push(toCapitalize(authorNameOrAuthorNameList));
      } else {
        authorNameOrAuthorNameList.forEach((authorName) => {
          author.push(toCapitalize(authorName));
        });
      }
    } else {
      author.push(toCapitalize(authorNameOrAuthorNameList));
    }
  });
  author = [...new Set(author)];
  for (i = 0; i < author.length; i++) {
    addAuthor(author[i]);
  }
};
const initBook = () => {
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic')
  );
  for (i = 0; i < results.length; i++) {
    comic = JSON.parse(
      fs.readFileSync('D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic\\' + results[i])
    );
    addBook(comic);
  }
};
const initGenre = () => {
  let genreList = [];
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic')
  );
  for (i = 0; i < results.length; i++) {
    comic = JSON.parse(
      fs.readFileSync('D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic\\' + results[i])
    );
    genreList = [...genreList, ...comic.detail.genres];
  }
  genreList = [...new Set(genreList)];
  for (let i = 0; i < genreList.length; i++) {
    db.Genre.create({ name: genreList[i] });
  }
};
const initBookAuthor = async () => {
  let comic;
  let book;
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic')
  );
  const authorList = await db.Author.findAll();
  for (let i = 0; i < authorList.length; i++) {
    for (let j = 0; j < results.length; j++) {
      comic = JSON.parse(
        fs.readFileSync('D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic\\' + results[j])
      );
      if (!toCapitalize(comic.detail.author).includes(authorList[i].dataValues.name)) {
        continue;
      }
      book = await db.Book.findOne({
        where: {
          name: comic.detail.title,
        },
      });
      await db.sequelize.query(
        `INSERT INTO book_author (authorId,bookId) values (${authorList[i].dataValues.id},${book.id})`,
        {
          type: db.sequelize.QueryTypes.INSERT,
        }
      );
    }
  }
};
const initBookGenre = async () => {
  let comic;
  let book;
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic')
  );
  const genreList = await db.Genre.findAll();
  for (let i = 0; i < genreList.length; i++) {
    for (let j = 0; j < results.length; j++) {
      comic = JSON.parse(
        fs.readFileSync('D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic\\' + results[j])
      );
      if (!comic.detail.genres.includes(genreList[i].dataValues.name)) {
        continue;
      }
      book = await db.Book.findOne({
        where: {
          name: comic.detail.title,
        },
      });

      await db.sequelize.query(
        `INSERT INTO book_genre (genreId,bookId) values (${genreList[i].dataValues.id},${book.id})`,
        {
          type: db.sequelize.QueryTypes.INSERT,
        }
      );
    }
  }
};
module.exports = initBookGenre;
