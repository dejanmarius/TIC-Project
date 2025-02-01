const express = require('express');
const authAdmin = require('../middlewares/authAdmin');
const router = express.Router();
const { addMovie, getMovies, getMovieById, deleteMovie } = require('../movieManagement/movieService');

router.post('/movies', authAdmin, addMovie);
router.get('/movies', getMovies);
router.get('/movies/:movieId', getMovieById);
router.delete('/movies/:movieId', authAdmin, deleteMovie);

module.exports = router;
