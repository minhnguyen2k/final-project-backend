const bcrypt = require('bcrypt');
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const result = await bcrypt.hash(password, salt);
  return result;
};

module.exports = hashPassword;
