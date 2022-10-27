const express = require('express');
const morgan = require('morgan');
const bookRouter = require('./router/book');
const initBook = require('./utils/initdata');

const app = express();

app.use(morgan('dev'));
app.get('/home', (req, res) => res.send('Hello world!'));
app.use('/book', bookRouter);
// initAuthor();
app.listen(3000, () => console.log('App is being listen at port 3000'));
