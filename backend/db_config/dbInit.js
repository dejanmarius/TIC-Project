var admin = require("firebase-admin");

var serviceAccount = require("./tic2024-ec32a-firebase-adminsdk-t7lt4-ddb37b3852.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});