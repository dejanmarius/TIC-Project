const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db_config/dbInit');


const registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    const newUser = {
        email: email,
        password: password,
        role: 'user'
    }

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const emailInUse = await checkEmailNotInUse(email);
        if (!emailInUse) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        newUser.password = hashedPassword;

        await db.collection('users').add(newUser);
        res.status(201).json({ msg: 'User registered successfully' });

    }

    catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: "Server error." });
    }

}

const checkEmailNotInUse = async (email) => {
    try {
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('email', '==', email).limit(1).get();
        return querySnapshot.empty;
    } catch (error) {
        console.error("Error checking email:", error);
        throw error;
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const userToAuthenticate = {
        email: email,
        password: password
    };

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const querySnapshot = await db.collection('users').where('email', '==', userToAuthenticate.email).limit(1).get();

        if (querySnapshot.empty) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const userData = querySnapshot.docs[0].data();
        const isPasswordValid = await bcrypt.compare(userToAuthenticate.password, userData.password);

        if (isPasswordValid) {
            const token = jwt.sign(
                { email: userData.email, role: userData.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('authcookie', token, { httpOnly: true, secure: true });
            res.status(200).json({ msg: 'Login successful', token });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { registerUser, loginUser };