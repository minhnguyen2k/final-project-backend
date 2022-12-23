const express = require('express');
const bookRouter = require('./book.routes');
const genreRouter = require('./genre.routes');
const chapImageRouter = require('./chap-image.routes');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const authorRouter = require('./author.routes');
const chapRouter = require('./chap.routes');
const roleRouter = require('./role.routes');
const commentRouter = require('./comment.routes');
const apiRoute = express();

apiRoute.use('/books', bookRouter);
apiRoute.use('/genres', genreRouter);
apiRoute.use('/chap-images', chapImageRouter);
apiRoute.use('/auth', authRouter);
apiRoute.use('/users', userRouter);
apiRoute.use('/roles', roleRouter);
apiRoute.use('/authors', authorRouter);
apiRoute.use('/chaps', chapRouter);
apiRoute.use('/comments', commentRouter);

module.exports = apiRoute;
