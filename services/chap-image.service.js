const db = require('../models');
const cloudinary = require('cloudinary').v2;
const getAllChapImage = async (chapId) => {
  const result = await db.ChapImage.findAll({ where: { chapId } });
  return result;
};
const createChapImage = async (data) => {
  let chapImageRequest;
  const chapImageList = data.chapImageList;
  if (chapImageList.length > 1) {
    chapImageRequest = chapImageList.map((chapImage) => {
      return db.ChapImage.create({
        chapId: data.chapId,
        image: chapImage,
      });
    });
    await Promise.all(chapImageRequest);
  } else {
    await db.ChapImage.create({
      chapId: data.chapId,
      image: chapImageList[0],
    });
  }
};
const updateChapImage = async (id, data) => {
  const oldChapImage = await db.ChapImage.findOne({ where: { id } });
  if (oldChapImage) {
    oldChapImage.image = data.image;
    const result = await oldChapImage.save();
    return result;
  }
};
const deleteChapImage = async (id) => {
  const chapImageDeleted = await db.ChapImage.findOne({
    where: { id },
  });
  console.log(chapImageDeleted);
  await db.ChapImage.destroy({
    where: { id },
  });

  await cloudinary.uploader.destroy(chapImageDeleted.image);
};
module.exports = {
  getAllChapImage,
  createChapImage,
  updateChapImage,
  deleteChapImage,
};
