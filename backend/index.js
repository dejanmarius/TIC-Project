const express = require('express');
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
const cors = require('cors');
const httpLogger = require('morgan'); 
const logSlowRequests = require('./middlewares/logSlowRequest');
dotenv.config();

const app = express();

app.use(httpLogger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logSlowRequests(100));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});