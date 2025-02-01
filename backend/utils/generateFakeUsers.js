const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const db = require('../db_config/dbInit');

const generateFakeUsers = async (numUsers = 10) => {
        try {
            for (let i = 0; i < numUsers; i++) {
                const user = {
                    username: faker.internet.userName(),
                    email: faker.internet.email(),
                    passwordHash: await bcrypt.hash(faker.internet.password(), 10),
                    role: 'user',
                    watchlist: [],
                    reviews: [], 
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                const userRef = await db.collection('users').add(user);
               
            }
            console.log("Users generated successfully!");
        } catch (error) {
            console.error("Error generating users:", error.message);
        }
    };

module.exports = generateFakeUsers;