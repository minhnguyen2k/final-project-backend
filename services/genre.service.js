const db = require('../models');

const getAllGenres = async () => {
  const result = await db.Genre.findAll({ attributes: ['id', 'name'] });
  return result;
};

module.exports = {
  getAllGenres,
};
