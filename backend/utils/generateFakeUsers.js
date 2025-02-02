const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('../db_config/dbInit');

const generateFakeUsers = async (numUsers = 10) => {
    const credentials = []; 

    try {
        for (let i = 0; i < numUsers; i++) {
            const name = faker.person.firstName();
            const email = faker.internet.email();
            const passwordBeforeHash = faker.internet.password(); 
            const password = await bcrypt.hash(passwordBeforeHash, 10);

            const user = {
                name,
                email,
                password,
                role: 'user',
                watchlist: [],
                reviews: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await db.collection('users').add(user);
            credentials.push({ name, email, passwordBeforeHash });
        }

        const filePath = path.join(__dirname, 'users_credentials.json');
        fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));

        console.log("Users generated successfully!");

    } catch (error) {
        console.error("Error generating users:", error.message);
    }
};

module.exports = generateFakeUsers;
