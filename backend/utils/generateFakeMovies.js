const { faker } = require('@faker-js/faker');
const db = require('../db_config/dbInit');

const generateFakeMovies = async (numMovies = 10) => {
    const movieGenres = [
        "Action", "Adventure", "Comedy", "Drama", "Horror", 
        "Sci-Fi", "Thriller", "Romance", "Fantasy", "Animation"
    ];

    try {
        for (let i = 0; i < numMovies; i++) {
            const movie = {
                title: faker.lorem.words(3), 
                description: faker.lorem.paragraph(), 
                releaseDate: faker.date.past(10).toISOString().split('T')[0],
                imageUrl: faker.image.url() ,
                genres: [
                    faker.helpers.arrayElement(movieGenres),
                    faker.helpers.arrayElement(movieGenres)
                ],
                cast: [
                    {
                        actorId: faker.string.uuid(),  
                        name: faker.person.fullName(), // Corectat
                        role: faker.person.jobTitle()  // Corectat
                    },
                    {
                        actorId: faker.string.uuid(),  
                        name: faker.person.fullName(), // Corectat
                        role: faker.person.jobTitle()  // Corectat
                    }
                ], 
                director: faker.person.fullName(), // Corectat
                rating: parseFloat((Math.random() * 10).toFixed(1)), 
                reviewCount: 0, 
                status: faker.helpers.arrayElement(['available', 'coming_soon']), 
                reviews: [],
                createdAt: new Date().toISOString(),
            };

            const movieRef = await db.collection('movies').add(movie);
            
        }
        console.log("Movies generated successfully!");
    } catch (error) {
        console.error("Error generating movies:", error.message);
    }
};

module.exports = generateFakeMovies;
