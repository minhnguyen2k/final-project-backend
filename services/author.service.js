const { QueryTypes, Op } = require('sequelize');
const { Sequelize } = require('../models');
const db = require('../models');

const getAllAuthors = async () => {
  const result = await db.Author.findAll({ attributes: ['id', 'name'] });
  return result;
};

module.exports = {
  getAllAuthors,
};
