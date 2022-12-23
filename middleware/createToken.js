const jwt = require('jsonwebtoken');
require('dotenv').config();
const maxAge = 3 * 60 * 60 * 24;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

module.exports = createToken;
