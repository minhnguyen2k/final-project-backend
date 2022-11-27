const express = require('express');
const bookRouter = require('./book.routes');
const genreRouter = require('./genre.routes');
const chapImageRouter = require('./chap-image.routes');
const apiRoute = express();
apiRoute.use('/books', bookRouter);
apiRoute.use('/genres', genreRouter);
apiRoute.use('/chap-images', chapImageRouter);

module.exports = apiRoute;
