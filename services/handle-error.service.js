const handleAuth = (err) => {
  let errors = { message: '' };

  if (err.message === 'Incorrect email') {
    errors.message = 'Incorrect email';
  }

  if (err.message === 'Incorrect password') {
    errors.message = 'Incorrect password';
  }

  if (err.code === 11000) {
    errors.message = 'That email is already registered';
    return errors;
  }

  return errors;
};

module.exports = {
  handleAuth,
};
