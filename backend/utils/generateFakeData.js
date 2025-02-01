

const generateFakeUsers = require('./generateFakeUsers');
const generateFakeMovies = require('./generateFakeMovies');
const generateFakeReviews = require('./generateFakeReviews');

const generateFakeData = async () => {
    try {
        console.log('Generating fake users...');
        await generateFakeUsers(10); 

        console.log('Generating fake movies...');
        await generateFakeMovies(40); 

        console.log('Generating fake reviews...');
        await generateFakeReviews(45); 

        console.log('Fake data generation completed successfully!');
    } catch (error) {
        console.error("Error generating fake data:", error.message);
    }
};

generateFakeData();