const express = require('express');
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
const cors = require('cors');
const httpLogger = require('morgan'); 
const cookieParser = require("cookie-parser");
const logSlowRequests = require('./middlewares/logSlowRequest');
const userRoutes = require('../backend/userManagement/userRouter');
const movieRoutes = require('../backend/movieManagement/movieRouter');
const auth = require('./middlewares/auth');
dotenv.config();

const app = express();

app.use(httpLogger('dev'));

const corsConfig = {
    origin: 'http://localhost:8080', 
    credentials:true,
  };
  
app.use(cors(corsConfig));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logSlowRequests(100));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use( userRoutes);
app.use( movieRoutes);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});