const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.get('/home', (req, res) => res.send('Hello world!'));
app.listen(3000, () => console.log('App is being listen at port 3000'));
