const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const uploadImage = require('./utils/initdata');
const { checkCurrentUser } = require('./middleware/authMiddleware');
const setHeader = require('./middleware/setHeader');
require('dotenv').config();

const port = process.env.PORT || 3333;
const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('*', setHeader);
app.use('*', checkCurrentUser);

app.use('/api', require('./routes/router'));

app.get('/', (req, res) => {
  res.json({
    message: 'Wrong api path',
  });
});
app.get('*', (req, res) => {
  res.json({
    message: 'Wrong api path',
  });
});

// uploadImage();
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
