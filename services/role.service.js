const db = require('../models');

const getAllRoles = async () => {
  const result = await db.Role.findAll();
  return result;
};

module.exports = {
  getAllRoles,
};
