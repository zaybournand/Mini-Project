// mini-project/backend/index.js

// Load environment variables from .env file 
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 8080; // Default port for Cloud Run and local development


if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
  console.error("ERROR: Missing Firebase Admin SDK environment variables.");
  console.error("Please ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID are set.");
  // Exit if critical credentials are missing
  process.exit(1);
}

// Initialize Firebase Admin SDK

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  })
});

console.log('Firebase Admin SDK initialized successfully.');

// Enable CORS for all routes
app.use(cors({ origin: '*' })); 
app.use(express.json()); // Enable JSON body parsing

// Middleware to verify Firebase ID Token
const verifyIdToken = async (req, res, next) => {
  // Check for the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Unauthorized: No token provided or malformed header.' });
  }

  // Extract the ID token
  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Attach the decoded token (containing user info) to the request object
    req.user = decodedToken;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    // Return appropriate error based on the Firebase error code
    if (error.code === 'auth/id-token-expired') {
        return res.status(401).send({ error: 'Unauthorized: ID token expired.' });
    }
    return res.status(401).send({ error: 'Unauthorized: Invalid ID token.' });
  }
};

// --- Routes ---

app.get('/echo-user-info', verifyIdToken, (req, res) => {
  // If we reach here, req.user contains the decoded Firebase ID token 
  res.status(200).json({
    message: 'Successfully accessed protected endpoint!',
    userInfo: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
    },
    decodedToken: req.user,
  });
});

app.get('/', (req, res) => {
  res.status(200).send('Hello from the minimal Node.js backend! Access /echo-user-info with a valid token.');
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
  console.log(`Local URL: http://localhost:${port}`);
  console.log(`Protected endpoint: http://localhost:${port}/echo-user-info`);
});