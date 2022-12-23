const db = require('../models');
const bcrypt = require('bcrypt');

const handleSignUp = async (data) => {
  const member = await db.Role.findOne({ name: 'member' });
  const user = await db.User.findOne({
    where: { email: data.email },
  });
  if (user) {
    throw Error('Tài khoản email đã tồn tại');
  }
  await db.User.create({
    email: data.email,
    username: data.username,
    password: data.password,
    roleId: member.id,
  });
};

const handleLogin = async (email, password) => {
  const user = await db.User.findOne({
    where: { email },
    include: [{ model: db.Role, attributes: ['id', 'name'] }],
  });
  if (user) {
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      const { password, ...userInfo } = user.dataValues;
      return userInfo;
    }
    throw Error('Mật khẩu không chính xác');
  }
  throw Error('Tài khoản email không tồn tại');
};

module.exports = {
  handleLogin,
  handleSignUp,
};
