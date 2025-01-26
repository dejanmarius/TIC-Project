const express = require('express');
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
const cors = require('cors');
const httpLogger = require('morgan'); 
const cookieParser = require("cookie-parser");
const logSlowRequests = require('./middlewares/logSlowRequest');
const userRoutes = require('../backend/userManagement/userRouter');
dotenv.config();

const app = express();

app.use(httpLogger('dev'));

const corsConfig = {
    origin: 'http://localhost:8080', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };
  
app.use(cors(corsConfig));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logSlowRequests(100));
app.use( userRoutes);
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});