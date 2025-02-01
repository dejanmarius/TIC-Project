const db = require('../db_config/dbInit');
admin = require('firebase-admin');


const getMovies = async (req, res) => {
    try {
        const moviesRef = db.collection('movies');
        const querySnapshot = await moviesRef.get();

        if (querySnapshot.empty) {
            return res.status(200).json({message: 'No movies found.', 
                data: []}); 
        }

        const movies = [];
        querySnapshot.forEach(doc => {
            movies.push({
                id: doc.id, 
                ...doc.data() 
            });
        });

        return res.status(200).json(movies);
    } catch (error) {
        console.error('Error getting movies:', error);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movieId = req.params.movieId; 

        if (!movieId) {
            return res.status(400).json({ error: 'Movie ID is required.' });
        }

        const movieRef = db.collection('movies').doc(movieId);
        const movieDoc = await movieRef.get();

        if (!movieDoc.exists) {
            return res.status(404).json({ error: 'Movie not found.' });
        }

        return res.status(200).json({
            message: 'Movie retrieved successfully.',
            data: {
                id: movieDoc.id, 
                ...movieDoc.data()
            }
        });
    } catch (error) {
        console.error('Error getting movie by ID:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

const addMovie = async (req, res) => {
    const {
        title,
        description,
        releaseDate,
        genres,
        cast,
        director,
        rating,
        reviewCount,
        averageRating,
        status,
        reviews,
        createdAt,
        updatedAt
    } = req.body;

    if ( !title || !description || !releaseDate || !genres || !cast || !director || !rating || !status) {
        return res.status(400).json({ error: 'All required fields are missing' });
    }

    const newMovie = {
        title: title,
        description: description,
        releaseDate: releaseDate,
        genres: genres,
        cast: cast,
        director: director,
        rating: rating,
        reviewCount: reviewCount || 0, 
        averageRating: averageRating || rating, 
        status: status,
        reviews: reviews || [], 
        createdAt: createdAt || new Date().toISOString(), 
        updatedAt: updatedAt || new Date().toISOString() 
    };

    try {
        const movieRef = db.collection('movies').doc(movieId);
        const movieDoc = await movieRef.get();
        if (movieDoc.exists) {
            return res.status(400).json({ error: 'Movie already exists' });
        }

        await movieRef.set(newMovie);
        res.status(201).json({ msg: 'Movie added successfully', movie: newMovie });
    } catch (error) {
        console.error('Error during adding movie:', error);
        return res.status(500).json({ error: "Server error." });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;

        if (!movieId) {
            return res.status(400).json({ error: 'Movie Id is required.' });
        }

        const movieRef = db.collection('movies').doc(movieId);
        const movieDoc = await movieRef.get();

        if (!movieDoc.exists) {
            return res.status(404).json({ error: 'Movie not found.' });
        }

        // Remove movie from all user watchlists
        const usersRef = db.collection('users');
        const usersSnapshot = await usersRef.get();

        usersSnapshot.forEach(async (userDoc) => {
            const userId = userDoc.id;
            const userRef = usersRef.doc(userId);
            const user = userDoc.data();
            
            if (user.watchlist && user.watchlist.includes(movieId)) {
                // Remove the movieId from the user's watchlist
                await userRef.update({
                    watchlist: admin.firestore.FieldValue.arrayRemove(movieId)
                });
            }
        });

        // Delete the movie document
        await movieRef.delete();
        return res.status(200).json({ message: 'Movie deleted successfully.' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


   
module.exports = { getMovies, getMovieById, addMovie, deleteMovie };
