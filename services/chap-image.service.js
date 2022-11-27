const { QueryTypes, Op } = require('sequelize');
const { Sequelize } = require('../models');
const db = require('../models');

const getAllChapImage = async (chapId) => {
  const result = await db.ChapImage.findAll({ where: { chapId } });
  return result;
};
module.exports = {
  getAllChapImage,
};
