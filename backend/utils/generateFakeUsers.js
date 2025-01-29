const faker = require('faker');
const bcrypt = require('bcrypt');
const db = require('../db_config/dbInit');

const generateFakeUsers = async (numUsers = 10) => {
    try {
        for (let i = 0; i < numUsers; i++) {
            const email = faker.internet.email();
            const password = faker.internet.password();
            const role = 'user';
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                email: email,
                password: hashedPassword,
                role: role,
                createdAt: new Date(),
            };

            await db.collection('users').add(newUser);
            console.log(`User ${email} created successfully!`);
        }
    } catch (error) {
        console.error("Error generating users:", error.message);
    }
};

module.exports = generateFakeUsers;