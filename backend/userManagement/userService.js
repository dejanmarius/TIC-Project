const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db_config/dbInit');
const admin = require('firebase-admin');

const registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    const newUser = {
        name:username,
        email: email,
        password: password,
        role: 'user',
        createdAt: new Date()
    }

    if (!username||!email || !password ) {
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

            res.cookie('authcookie', token, { httpOnly: true, secure: false ,maxAge: 3600000 });
            res.status(200).json({ msg: 'Login successful', role: userData.role, name: userData.name, userId: querySnapshot.docs[0].id });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

const logoutUser = (req, res) => {
    console.log('Logout request received');
    res.clearCookie('authcookie',{ httpOnly: true, secure: false });
    res.status(200).json({ msg: 'Logout successful' });
}

const addToWatchlist = async (req, res) => {
    try {
        const { userId, movieId } = req.body;

        if (!userId || !movieId) {
            return res.status(400).json({ message: "User Id and Movie Id are required." });
        }

        console.log(`Adding movieId ${movieId} to userId ${userId} watchlist`);


        const watchlistItem = {
            movieId: movieId,
            addedAt: new Date().toISOString() 
        };

        const userRef = db.collection('users').doc(userId);
        await userRef.update({
            watchlist: admin.firestore.FieldValue.arrayUnion(watchlistItem)
        });

        res.status(200).json({ message: "Movie added to watchlist." });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getWatchlist = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User Id is required." });
        }

        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found." });
        }

        const watchlist = userDoc.data().watchlist || [];
        if (watchlist.length === 0) {
            return res.status(200).json({ watchlist: [] });
        }
        const movieDetailsPromises = watchlist.map(async (item) => {
            const movieDoc = await db.collection('movies').doc(item.movieId).get();
            if (!movieDoc.exists) {
                console.warn(`Movie not found: ${item.movieId}`);
                return null;
            }
            return { id: movieDoc.id, ...movieDoc.data(), addedAt: item.addedAt };
        });

        const moviesWithDetails = (await Promise.all(movieDetailsPromises)).filter(movie => movie !== null);

        res.status(200).json({ watchlist: moviesWithDetails });
    } catch (error) {
        console.error("Error getting watchlist:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const deleteMovieFromWatchlist = async (req, res) => {
    try {
      const { userId, movieId } = req.params;
  
      if (!userId || !movieId) {
        return res.status(400).json({ message: "User Id and Movie Id are required." });
      }
  
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Fetch current watchlist
      const user = userDoc.data();
      const updatedWatchlist = user.watchlist.filter(item => item.movieId !== movieId);  // Filtrez doar filmul cu movieId respectiv
  
      // Verifică dacă watchlist-ul a fost actualizat corect
      if (updatedWatchlist.length === user.watchlist.length) {
        return res.status(404).json({ message: "Movie not found in watchlist." });  // Dacă nu există filmul, returnează eroare
      }
  
      // Actualizează watchlist-ul utilizatorului
      await userRef.update({
        watchlist: updatedWatchlist
      });
  
      res.status(200).json({ message: "Movie deleted from watchlist." });
    } catch (error) {
      console.error("Error deleting from watchlist:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  


const getUsers = async (req, res) => {
    try {
        const usersRef = db.collection('users');
        const usersSnapshot = await usersRef.get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};




module.exports = { registerUser, loginUser,logoutUser, addToWatchlist, getWatchlist, getUsers, deleteMovieFromWatchlist };