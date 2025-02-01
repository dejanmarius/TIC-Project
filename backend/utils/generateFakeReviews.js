const { faker } = require('@faker-js/faker');
const db = require('../db_config/dbInit');

const generateFakeReviews = async (numReviews = 20) => {
    try {

        const usersSnapshot = await db.collection('users').get();
        const moviesSnapshot = await db.collection('movies').get();

        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const movies = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (users.length === 0 || movies.length === 0) {
            throw new Error('No users or movies found in the database.');
        }

        for (let i = 0; i < numReviews; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];

            const reviewRating = Math.floor(Math.random() * 10) + 1;
            const review = {
                userId: randomUser.id,
                username: randomUser.username,
                movieId: randomMovie.id,
                rating: reviewRating,
                reviewText: faker.lorem.paragraph(),
                createdAt: new Date().toISOString(),
            };

            const reviewRef = await db.collection('reviews').add(review);
            


            const movieRef = db.collection('movies').doc(randomMovie.id);
            const movieData = randomMovie;

            const newReviewCount = movieData.reviewCount + 1;
            const newAverageRating = ((movieData.rating * movieData.reviewCount) + reviewRating) / newReviewCount;

         
            await movieRef.update({
                reviewCount: newReviewCount,
                rating: newAverageRating.toFixed(1), 
            });

            
        }
        console.log("Reviews generated successfully!");
    } catch (error) {
        console.error("Error generating reviews:", error.message);
    }
};

module.exports = generateFakeReviews;
