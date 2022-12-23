const db = require('../models');
const cloudinary = require('cloudinary').v2;
const getAllChaps = async (id) => {
  const result = await db.Chap.findAll({ where: { bookId: id } });
  return result;
};
const createChap = async (data) => {
  let chapRequest;
  const chapNameList = data.chapNameList;
  if (chapNameList.length > 1) {
    chapRequest = chapNameList.map((chapName) => {
      return db.Chap.create({
        bookId: data.bookId,
        chapName,
      });
    });
    await Promise.all(chapRequest);
  } else {
    await db.Chap.create({
      bookId: data.bookId,
      chapName: chapNameList[0],
    });
  }
};
const updateChap = async (id, data) => {
  const oldChap = await db.Chap.findOne({ where: { id } });
  if (oldChap) {
    oldChap.chapName = data.chapName;
    const result = await oldChap.save();
    return result;
  }
};

const deleteChap = async (id) => {
  const chapDeleted = await db.Chap.findOne({
    where: { id },
    include: [{ model: db.Book }, { model: db.ChapImage }],
  });
  await db.Chap.destroy({
    where: { id },
  });
  if (chapDeleted.ChapImages.length > 0) {
    await cloudinary.api.delete_resources_by_prefix(
      `comics/${chapDeleted.Book.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/ - /g, '-')
        .replace(/ /g, '-')}/${chapDeleted.chapName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/ - /g, '-')
        .replace(/ /g, '-')}`
    );

    await cloudinary.api.delete_folder(
      `comics/${chapDeleted.Book.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/ - /g, '-')
        .replace(/ /g, '-')}/${chapDeleted.chapName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/ - /g, '-')
        .replace(/ /g, '-')}`
    );
  } else {
    try {
      await cloudinary.api.delete_folder(
        `comics/${chapDeleted.Book.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D')
          .replace(/ - /g, '-')
          .replace(/ /g, '-')}/${chapDeleted.chapName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D')
          .replace(/ - /g, '-')
          .replace(/ /g, '-')}`
      );
    } catch (error) {
      throw error;
    }
  }
};

module.exports = {
  getAllChaps,
  createChap,
  updateChap,
  deleteChap,
};
