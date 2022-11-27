const db = require('../models');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { QueryTypes } = require('sequelize');

const toCapitalize = (string) => {
  return string
    .toLowerCase()
    .split(' ')
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ');
};
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
const addAuthor = async (authorName) => {
  await db.Author.create({ name: authorName });
};
const addBook = async (book) => {
  await db.Book.create({
    name: book.detail.title,
    description: book.description,
    image: book.detail.image,
    viewCount: getRandomInt(500, 2500),
    voteCount: getRandomInt(0, 11),
  });
};
const addChap = async (bookId, chapName) => {
  await db.Chap.create({
    bookId,
    chapName,
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
      if (!toCapitalize(comic.detail.author).includes(authorList[i].name)) {
        continue;
      }
      book = await db.Book.findOne({
        where: {
          name: comic.detail.title,
        },
      });
      await db.sequelize.query(
        `INSERT INTO book_author (authorId,bookId) values ("${authorList[i].id}","${book.id}")`,
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

      if (!comic.detail.genres.includes(genreList[i].name)) {
        continue;
      }
      book = await db.Book.findOne({
        where: {
          name: comic.detail.title,
        },
      });

      await db.sequelize.query(
        `INSERT INTO book_genre (genreId,bookId) values ("${genreList[i].id}","${book.id}")`,
        {
          type: db.sequelize.QueryTypes.INSERT,
        }
      );
    }
  }
};
const initChap = async () => {
  let book;
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpComic')
  );
  for (i = 0; i < results.length; i++) {
    comicChaps = fs.readdirSync(
      path.resolve(
        __dirname,
        'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' + results[i]
      )
    );
    book = await db.Book.findOne({
      where: {
        image: JSON.parse(
          fs.readFileSync('D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic\\' + results[i])
        ).detail.image,
      },
    });
    for (let j = 0; j < comicChaps.length; j++) {
      addChap(book.id, comicChaps[j]);
    }
  }
};
const deleteLastImage = async () => {
  let totalChap = [];
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic')
  );

  for (i = 0; i < results.length; i++) {
    comicChaps = fs.readdirSync(
      path.resolve(
        __dirname,
        'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' + results[i]
      )
    );
    totalChap = totalChap.concat(comicChaps);
    // for (j = 0; j < comicChaps.length; j++) {
    //   chaps = fs.readdirSync(
    //     path.resolve(
    //       __dirname,
    //       'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' +
    //         results[i] +
    //         '\\' +
    //         comicChaps[j] +
    //         '\\'
    //     )
    //   );
    // if (chaps.length === 0) {
    //   fs.rmdirSync(
    //     'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' +
    //       results[i] +
    //       '\\' +
    //       comicChaps[j] +
    //       '\\'
    //   );
    // }
    // if (chaps.length === 19) continue;
    // fs.unlinkSync(
    //   'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' +
    //     results[i] +
    //     '\\' +
    //     comicChaps[j] +
    //     '\\' +
    //     chaps[chaps.length - 1]
    // );
  }
  console.log(totalChap.length);
};

const uploadImage = async () => {
  let book;
  let chapDb;
  const results = fs.readdirSync(
    path.resolve(__dirname, 'D:\\contentcrawler\\src\\models\\comiccrawler\\dumpComic')
  );
  for (i = 0; i < results.length; i++) {
    comicChaps = fs.readdirSync(
      path.resolve(
        __dirname,
        'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' + results[i]
      )
    );
    book = await db.Book.findOne({
      where: {
        image: JSON.parse(
          fs.readFileSync('D:\\contentcrawler\\src\\models\\comiccrawler\\dumpcomic\\' + results[i])
        ).detail.image,
      },
    });

    for (j = 0; j < comicChaps.length; j++) {
      chapDb = await db.Chap.findOne({
        where: {
          bookId: book.id,
          chapName: comicChaps[j],
        },
      });
      chaps = fs.readdirSync(
        path.resolve(
          __dirname,
          'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' +
            results[i] +
            '\\' +
            comicChaps[j]
        )
      );
      const requests = chaps.map((chap, index) => {
        let publicId = !chap.includes('Trang')
          ? `${chap
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/Đ/g, 'D')
              .replace(/ - /g, '-')
              .replace(/ /g, '-')
              .replace('.jpg', '')}-page-0`
          : `${chap
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/Đ/g, 'D')
              .replace(/ - /g, '-')
              .replace(/ /g, '-')
              .replace('Trang', 'page')
              .replace('.jpg', '')}`;

        return cloudinary.uploader.upload(
          'D:\\contentcrawler\\src\\models\\comiccrawler\\downloadcomic\\' +
            results[i] +
            '\\' +
            comicChaps[j] +
            '\\' +
            chap,
          {
            use_filename: false,
            unique_filename: false,
            overwrite: true,
            public_id: publicId,
            folder: `comics/${results[i]
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/Đ/g, 'D')
              .replace(/ - /g, '-')
              .replace(/ /g, '-')}/${comicChaps[j].replace(/ /g, '-')}`,
          }
        );
      });

      try {
        const response = await Promise.all(requests);
        for (let n = 0; n < response.length; n++) {
          await db.ChapImage.create({
            chapId: chapDb.id,
            image: response[n].secure_url,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log('Done ' + i);
  }
};

const insertChap20 = async () => {
  try {
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'comics/Umi-no-Misaki/Chapter-20',
      max_results: 30,
    });
    for (let h = 0; h < response.resources.length; h++) {
      await db.ChapImage.create({
        chapId: '84ed9bef-60ce-4568-a1bb-cef9e5a30dcd',
        image: response.resources[h].secure_url,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = insertChap20;
