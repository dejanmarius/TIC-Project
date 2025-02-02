const { faker } = require('@faker-js/faker');
const db = require('../db_config/dbInit');

const generateFakeMovies = async (numMovies = 10) => {
    const movieGenres = [
        "Action", "Adventure", "Comedy", "Drama", "Horror",
        "Sci-Fi", "Thriller", "Romance", "Fantasy", "Animation"
    ];

    try {
        // Obținem toți utilizatorii pentru a genera watchlist și recenzii
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (let i = 0; i < numMovies; i++) {
            const movie = {
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                releaseDate: faker.date.past(10).toISOString().split('T')[0],
                imageUrl: faker.image.url({ width: 200, height: 300 }),
                genres: [
                    faker.helpers.arrayElement(movieGenres),
                    faker.helpers.arrayElement(movieGenres)
                ],
                cast: [
                    {
                        actorId: faker.string.uuid(),
                        name: faker.person.fullName(),
                        role: faker.person.jobTitle()
                    },
                    {
                        actorId: faker.string.uuid(),
                        name: faker.person.fullName(),
                        role: faker.person.jobTitle()
                    }
                ],
                director: faker.person.fullName(),
                rating: 0, // Inițial, rating 0, va fi actualizat cu recenziile
                reviewCount: 0,
                reviews: [], // Array gol inițial
                status: faker.helpers.arrayElement(['available', 'coming_soon']),
                createdAt: new Date().toISOString(),
            };

            const movieRef = await db.collection('movies').add(movie);
            const movieId = movieRef.id;

            let totalRating = 0;
            let reviewCount = 0;
            let movieReviews = [];

            // Adăugăm filmul în watchlist-ul unor utilizatori aleatori și generăm recenzii
            const numWatchlistEntries = Math.floor(Math.random() * users.length);

            for (let j = 0; j < numWatchlistEntries; j++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const userRef = db.collection('users').doc(randomUser.id);

                // Adăugăm filmul în watchlist-ul utilizatorului
                const watchlistEntry = {
                    movieId,
                    addedAt: new Date().toISOString(),
                };

                await userRef.update({
                    watchlist: [...(randomUser.watchlist || []), watchlistEntry]
                });

                // Creăm recenzia
                const review = {
                    reviewId: faker.string.uuid(),
                    userId: randomUser.id,
                    username: randomUser.name,
                    rating: Math.floor(Math.random() * 10) + 1,
                    comment: faker.lorem.paragraph(),
                    createdAt: new Date().toISOString(),
                };

                movieReviews.push(review); // Adăugăm recenzia în array

                // Salvăm ID-ul recenziei la utilizator
                await userRef.update({
                    reviews: [...(randomUser.reviews || []), review.reviewId]
                });

                // Actualizăm rating-ul total și numărul de recenzii
                totalRating += review.rating;
                reviewCount++;
            }

            // Calculăm media rating-ului și actualizăm filmul
            const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;
            await movieRef.update({
                reviewCount,
                rating: averageRating,
                reviews: movieReviews // Adăugăm array-ul de recenzii în film
            });
        }

        console.log("Movies with watchlist entries and reviews (as arrays) generated successfully!");
    } catch (error) {
        console.error("Error generating movies:", error.message);
    }
};

module.exports = generateFakeMovies;
