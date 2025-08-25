🚀 Mini-Project: Click Counter & API Echo
This project demonstrates a full-stack web application built with React, Firebase, and Node.js, showcasing integration between frontend, backend, authentication, data tracking, and deployment on Google Cloud.

✨ Features
User Authentication: Secure sign-up and login functionality using Firebase Authentication (Email/Password).

Personal Click Tracking: Users can click a button, and their individual click count is stored and updated in real-time in Firestore.

Real-time Usage Display: Each logged-in user can view their personal click count directly on the page.

Protected Backend API: A minimal Node.js Express backend with an endpoint that echoes authenticated user information. This endpoint is protected by Firebase ID Token verification.

Responsive UI: A clean, modern, and responsive user interface built with React and Tailwind CSS.

Cloud Deployment: Frontend hosted on Firebase Hosting and backend deployed on Google Cloud Run.

🛠️ Technologies Used
Frontend:

React.js

Tailwind CSS

Firebase SDK (for Web) (Authentication, Firestore)

Backend:

Node.js

Express.js

Firebase Admin SDK

CORS

Dotenv (for local environment variables)

Database:

Google Cloud Firestore

Deployment & Hosting:

Firebase Hosting (for Frontend)

Google Cloud Run (for Backend)

Google Cloud Build (for containerization)

Google Container Registry (GCR)

📦 Local Development Setup
Follow these steps to get the application running on your local machine.

1. Clone the Repository
   git clone https://github.com/zaybournand/Mini-Project.git
   cd Mini-Project

2. Frontend Setup (React App)
   Navigate into the root of the React app:

cd mini-project # This is the folder containing package.json for React

a. Install Dependencies
npm install

b. Firebase Project Configuration (src/FirebaseConfig.js)
You need to connect your React app to your Firebase project.

Go to your Firebase Console and select your Mini-Project.

In Project settings (gear icon) > General, scroll down to the "Your apps" section.

If you haven't added a web app, click the </> icon to add one. Copy the firebaseConfig object.

Open src/FirebaseConfig.js in your React project.

Replace the placeholder values in LOCAL_FIREBASE_CONFIG_FALLBACK with your actual Firebase project configuration. Also, set LOCAL_APP_ID_FALLBACK to your Firebase project ID.

const LOCAL_APP_ID_FALLBACK = 'YOUR_FIREBASE_PROJECT_ID'; // e.g., 'mini-project-e570c'

const LOCAL_FIREBASE_CONFIG_FALLBACK = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT_ID.appspot.com",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_FIREBASE_APP_ID",
};

Save src/FirebaseConfig.js.

c. Enable Firebase Authentication (Email/Password)
In your Firebase Console for your Mini-Project, go to Build > Authentication.

Navigate to the "Sign-in method" tab.

Enable the "Email/Password" provider.

d. Set Up Firestore Database and Security Rules
In your Firebase Console for your Mini-Project, go to Build > Firestore Database.

Click "Create database" and select "Start in production mode". Choose an appropriate region (e.g., nam7 for East Coast US).

Once created, go to the "Rules" tab.

Replace the default rules with the following and click "Publish":

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /artifacts/{appId} {
match /users/{userId}/{documents=\*\*} {
allow read, write: if request.auth != null && request.auth.uid == userId;
}
}
}
}

e. Run Frontend Locally
npm start

The app will open in your browser (usually http://localhost:3000).

3. Backend Setup (Node.js App)
   Open a new terminal window and navigate into the backend directory:

cd mini-project/backend

a. Install Dependencies
npm install

b. Configure Firebase Admin SDK Credentials (.env file)
The backend needs Firebase Admin SDK credentials to verify user tokens.

In your Firebase Console for your Mini-Project, go to Project settings > Service accounts.

Click "Generate new private key". This downloads a JSON file (e.g., your-project-id-firebase-adminsdk-xxxxx-xxxxxxxxxx.json). Keep this file secure and DO NOT commit it to Git.

Rename .env.example to .env in your backend folder.

Open the downloaded JSON file and copy the project_id, private_key, and client_email values.

Paste these values into your .env file:

# mini-project/backend/.env

FIREBASE_PROJECT_ID=your-project-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_LONG_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@appspot.gserviceaccount.com

Crucial: Ensure FIREBASE_PRIVATE_KEY is a single-line string with \n replacing actual newlines, or copy the entire content in double quotes. The backend code handles unescaping these.

c. Run Backend Locally
npm run dev # Uses nodemon for auto-restart on changes

The backend server will start on http://localhost:8080.

🚀 Deployment to Google Cloud

1. Deploy Frontend to Firebase Hosting
   a. Install Firebase CLI & Login
   npm install -g firebase-tools
   firebase login

b. Initialize Firebase Hosting (in React app root)
Navigate to mini-project (your React app root) and run:

cd mini-project
firebase init hosting

Select your Mini-Project.

Public directory: build

Configure as single-page app: Y

c. Build React App
npm run build

d. Deploy Frontend
firebase deploy --only hosting

This will provide your Frontend Hosting URL.

2. Deploy Backend to Google Cloud Run
   a. Install & Configure Google Cloud CLI (gcloud)
   npm install -g @google-cloud/cli # If not installed
   gcloud auth login
   gcloud config set project YOUR_FIREBASE_PROJECT_ID # e.g., mini-project-e570c

b. Enable Cloud Build API
If prompted during gcloud builds submit, or proactively:

Go to Google Cloud Console for your Mini-Project.

Search for "Cloud Build API" and ensure it's "Enabled."

c. Grant Permissions to Cloud Build Service Account
In your Google Cloud Console for your Mini-Project:

Go to IAM & Admin > IAM.

Identify your Default Compute Engine service account: [PROJECT_NUMBER]-compute@developer.gserviceaccount.com (e.g., 883025382476-compute@developer.gserviceaccount.com).

Grant the following roles to this service account:

Cloud Build Service Account

Storage Admin

Service Account User

Wait 5-10 minutes for permissions to propagate.

d. Build and Push Docker Image
Navigate to your backend folder (mini-project/backend).

cd mini-project/backend
gcloud builds submit --tag gcr.io/YOUR_FIREBASE_PROJECT_ID/click-tracker-backend

# Example: gcloud builds submit --tag gcr.io/mini-project-e570c/click-tracker-backend

If prompted to enable APIs, type Y.

e. Deploy to Cloud Run
First, prepare your sensitive keys as shell variables for the deploy command:

# Define the path to your Firebase service account JSON file (in the backend folder)

SERVICE_ACCOUNT_JSON_PATH="./your-project-id-firebase-adminsdk-xxxxx-xxxxxxxxxx.json" # <--- ADJUST THIS FILENAME!

# Extract the private key

PRIVATE_KEY=$(jq -r .private_key "$SERVICE_ACCOUNT_JSON_PATH")

# Extract the client email

CLIENT_EMAIL=$(jq -r .client_email "$SERVICE_ACCOUNT_JSON_PATH")

Then, run the deploy command:

gcloud run deploy click-tracker-backend \
 --image gcr.io/YOUR_FIREBASE_PROJECT_ID/click-tracker-backend \
 --platform managed \
 --region us-east4 \
 --allow-unauthenticated \
 --set-env-vars FIREBASE_PROJECT_ID='YOUR_FIREBASE_PROJECT_ID' \
 --set-env-vars FIREBASE_PRIVATE_KEY="${PRIVATE_KEY}" \
  --set-env-vars FIREBASE_CLIENT_EMAIL="${CLIENT_EMAIL}"

# Example: gcloud run deploy click-tracker-backend --image gcr.io/mini-project-e570c/click-tracker-backend --platform managed --region us-east4 --allow-unauthenticated --set-env-vars FIREBASE_PROJECT_ID='mini-project-e570c' --set-env-vars FIREBASE_PRIVATE_KEY="${PRIVATE_KEY}" --set-env-vars FIREBASE_CLIENT_EMAIL="${CLIENT_EMAIL}"

This will provide your Backend Service URL.

3. Update Frontend with Backend URL and Re-deploy
   Open mini-project/src/App.js.

Update the BACKEND_URL constant with your Cloud Run Service URL.

const BACKEND_URL = 'https://your-cloud-run-service-url.a.run.app';

Save src/App.js.

Re-build frontend: cd mini-project && npm run build

Re-deploy frontend: firebase deploy --only hosting

🔗 Live URLs
Frontend (Firebase Hosting): https://YOUR_FIREBASE_HOSTING_URL.web.app (e.g., https://mini-project-e570c.web.app)

Backend (Cloud Run API): https://YOUR_CLOUD_RUN_SERVICE_URL.a.run.app (e.g., https://click-tracker-backend-xxxxxx-uc.a.run.app)

🔐 Brief Note on Security
Firebase Authentication: Handles user identity securely with email/password.

Firestore Security Rules: allow read, write: if request.auth != null && request.auth.uid == userId; ensures strict data isolation, where each user can only access and modify their own click_count document.

Backend API Authentication: The Node.js backend uses the Firebase Admin SDK to verify the client's Firebase ID token (admin.auth().verifyIdToken()). This ensures that only requests from valid, authenticated Firebase users can access the protected /echo-user-info endpoint.

Environment Variables: Sensitive Firebase Admin SDK credentials (private key, client email) are stored securely as environment variables on Cloud Run, not directly in the deployed code, following best practices for cloud deployments.

CORS: For production, the backend's CORS policy (app.use(cors({ origin: '\*' }));) should be updated to specifically allow requests only from your deployed frontend's URL (e.g., origin: 'https://YOUR_FIREBASE_HOSTING_URL.web.app') to prevent unauthorized cross-origin requests.
