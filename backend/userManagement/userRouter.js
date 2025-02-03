const express = require('express');
const router = express.Router();
const { registerUser, loginUser,logoutUser, addToWatchlist, getWatchlist,getUsers, deleteMovieFromWatchlist, updateUser, deleteUser} = require('../userManagement/userService');
const auth = require('../middlewares/auth');
const authAdmin= require('../middlewares/authAdmin');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/users/:userId/watchlist',auth, addToWatchlist);
router.get('/users/:userId/watchlist',auth, getWatchlist);
router.delete('/users/:userId/watchlist/:movieId',auth, deleteMovieFromWatchlist);
router.get('/users',authAdmin, getUsers);
router.put('/users/:id',authAdmin, updateUser);
router.delete('/users/:id',authAdmin, deleteUser);


module.exports = router;