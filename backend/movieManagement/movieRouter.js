const express = require('express');
const authAdmin = require('../middlewares/authAdmin');
const auth = require('../middlewares/auth');
const router = express.Router();
const { addMovie, getMovies, getMovieById, deleteMovie,addReview, updateMovie } = require('../movieManagement/movieService');

router.post('/movies', authAdmin, addMovie);
router.get('/movies', getMovies);
router.get('/movies/:movieId', getMovieById);
router.delete('/movies/:movieId', authAdmin, deleteMovie);
router.post('/movies/:movieId/reviews',auth, addReview);
router.put('/movies/:movieId',authAdmin, updateMovie);

module.exports = router;
