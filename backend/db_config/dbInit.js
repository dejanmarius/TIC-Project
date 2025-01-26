var admin = require("firebase-admin");

var serviceAccount = require("./tic2024-ec32a-firebase-adminsdk-t7lt4-cd9136f5b4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
module.exports = db