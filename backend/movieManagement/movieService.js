const db = require('../db_config/dbInit');
admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const getMovies = async (req, res) => {
    try {
        const moviesRef = db.collection('movies');
        const querySnapshot = await moviesRef.get();

        if (querySnapshot.empty) {
            return res.status(200).json({
                message: 'No movies found.',
                data: []
            });
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

    if (!title || !description || !releaseDate || !genres || !cast || !director || !rating || !status) {
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

        const usersRef = db.collection('users');
        const usersSnapshot = await usersRef.get();

        
        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const userRef = usersRef.doc(userId);
            const user = userDoc.data();

            if (user.watchlist && Array.isArray(user.watchlist)) {
   
                const movieInWatchlist = user.watchlist.find(item => item.movieId === movieId);
                
                if (movieInWatchlist) {
                    await userRef.update({
                        watchlist: admin.firestore.FieldValue.arrayRemove(movieInWatchlist)
                    });
                }
            }
        }


        await movieRef.delete();
        return res.status(200).json({ message: 'Movie deleted successfully.' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const addReview = async (req, res) => {
    const { movieId } = req.params;
    console.log('Movie ID:', movieId);

    const { userId, username, rating, comment } = req.body;

    if (!userId || !username || !rating || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const movieRef = db.collection('movies').doc(movieId);
        const movieDoc = await movieRef.get();

        if (!movieDoc.exists) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const reviewId = uuidv4();

        const newReview = {
            reviewId,
            userId,
            username,
            rating,
            comment,
            createdAt: new Date().toISOString(),
        };

        // Adăugăm recenzia la film
        await movieRef.update({
            reviews: admin.firestore.FieldValue.arrayUnion(newReview),
        });

        // Adăugăm reviewId la utilizator (pentru referință)
        await userRef.update({
            reviews: admin.firestore.FieldValue.arrayUnion(reviewId),
        });

        // Obținem filmul actualizat pentru a putea calcula rating-ul mediu și numărul de recenzii
        const updatedMovieDoc = await movieRef.get();
        const updatedMovie = updatedMovieDoc.data();

        // Calculează rating-ul mediu
        const allRatings = updatedMovie.reviews.map(review => review.rating);
        const averageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
        const roundedAverageRating = parseFloat(averageRating.toFixed(1));

        // Actualizează reviewCount și rating-ul mediu
        await movieRef.update({
            rating: roundedAverageRating,
            reviewCount: updatedMovie.reviews.length,
        });

        // Returnăm filmul actualizat cu review-urile
        res.status(201).json({
            message: 'Review added successfully',
            data: updatedMovie,
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error });
    }
};

const updateMovie = async (req, res) => {
    const movieId = req.params.movieId;
    const {
        title,
        description,
        releaseDate,
        director,
        rating,
    } = req.body;

    if (!title || !description || !releaseDate || !director || !rating) {
        return res.status(400).json({ error: 'All required fields are missing' });
    }

    const updatedMovie = {
        title: title,
        description: description,
        releaseDate: releaseDate,
        director: director,
        rating: rating,
        updatedAt: new Date().toISOString()
    };

    try {
        const movieRef = db.collection('movies').doc(movieId);
        const movieDoc = await movieRef.get();
        if (!movieDoc.exists) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        await movieRef.update(updatedMovie);
        res.status(200).json({ msg: 'Movie updated successfully', movie: updatedMovie });
    } catch (error) {
        console.error('Error during updating movie:', error);
        return res.status(500).json({ error: "Server error." });
    }
}

module.exports = { getMovies, getMovieById, addMovie, deleteMovie, addReview, updateMovie };
