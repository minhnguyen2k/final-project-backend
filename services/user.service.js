const db = require('../models');

const getAllUsers = async () => {
  const result = await db.User.findAll({ include: [{ model: db.Role }] });
  return result;
};
const updateUser = async (id, data) => {
  const oldUser = await db.User.findOne({ where: { id } });
  if (oldUser) {
    oldUser.email = data.email;
    oldUser.username = data.username;
    oldUser.roleId = data.roleId;
    const result = await oldUser.save();
    return result;
  }
};
const deleteUser = async (id) => {
  await db.User.destroy({
    where: { id },
  });
};
module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
