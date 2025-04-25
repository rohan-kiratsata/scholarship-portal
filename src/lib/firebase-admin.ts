import admin from "firebase-admin";

var serviceAccount = require("../scholarship-52560-firebase-adminsdk-fbsvc-8ad88709cd.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db };
