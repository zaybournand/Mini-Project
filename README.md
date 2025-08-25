# 🚀 Click Counter & API Echo: A Full-Stack Mini-Project

![Mini-Project Banner](https://placehold.co/1200x300/4F46E5/FFFFFF?text=Click+Counter+%26+API+Echo)

## 🌟 Project Overview

This mini-project is a comprehensive demonstration of building and deploying a modern full-stack web application. It showcases the seamless integration of a **React frontend**, **Firebase authentication** and **Firestore database**, a **Node.js backend API**, all hosted on **Google Cloud**. The core functionality allows users to track their personal button clicks while interacting with a protected backend endpoint.

---

## ✨ Core Features

- **Secure User Authentication:** Users can easily **sign up and log in** using email and password, powered by Firebase Authentication.
- **Personalized Click Tracking:** A dedicated button allows logged-in users to **increment a personal counter**, with data stored and updated in real-time in Google Cloud Firestore.
- **Real-time Usage Display:** Each user's individual click count is **displayed instantly** on their dashboard, reflecting real-time updates.
- **Protected Backend API:** A minimal Node.js Express backend provides a **secure endpoint** (`/echo-user-info`) that verifies Firebase ID tokens, echoing authenticated user details.
- **Responsive & Modern UI:** Crafted with **React and Tailwind CSS**, the frontend offers a clean, intuitive, and fully responsive user experience across devices.
- **Cloud-Native Deployment:** The entire application is deployed on Google Cloud, with the frontend on **Firebase Hosting** and the backend on **Google Cloud Run**.

---

## 🛠️ Technical Stack

### Frontend

- **Framework:** [React.js](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Firebase Integration:** [Firebase SDK (for Web)](https://firebase.google.com/docs/web/setup) (Authentication, Firestore)

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **Firebase Integration:** [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Utilities:** [CORS](https://www.npmjs.com/package/cors), [Dotenv](https://www.npmjs.com/package/dotenv) (for local environment variables)

### Database

- **NoSQL Database:** [Google Cloud Firestore](https://firebase.google.com/docs/firestore)

### Deployment & Hosting

- **Frontend Hosting:** [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Backend Hosting:** [Google Cloud Run](https://cloud.google.com/run)
- **Containerization:** [Google Cloud Build](https://cloud.google.com/cloud-build)
- **Container Registry:** [Google Container Registry (GCR)](https://cloud.google.com/container-registry)

---

## 📦 Getting Started: Local Development

Follow these instructions to set up and run the application on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/zaybournand/Mini-Project.git](https://github.com/zaybournand/Mini-Project.git)
cd Mini-Project

2. Frontend Setup (React App)
Navigate to the root of your React application:

Bash

cd mini-project # This is the main project folder containing package.json for React
a. Install Dependencies
Bash

npm install
b. Firebase Project Configuration (.env.production & Firebase Console)
Create .env.production: In the root of your mini-project folder, create a file named .env.production.

Populate .env.production: Add your Firebase client-side configuration and your backend's Cloud Run URL to this file. Replace all placeholder values with your actual project details from the Firebase Console.

Code snippet

# mini-project/.env.production
# --- Firebase Client-Side Configuration (from Firebase Console > Project settings > Your apps > Web app config) ---
REACT_APP_FIREBASE_API_KEY="YOUR_ACTUAL_FIREBASE_API_KEY"
REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_ACTUAL_PROJECT_ID.firebaseapp.com"
REACT_APP_FIREBASE_PROJECT_ID="YOUR_ACTUAL_PROJECT_ID"
REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_ACTUAL_PROJECT_ID.appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_ACTUAL_MESSAGING_SENDER_ID"
REACT_APP_FIREBASE_CLIENT_APP_ID="YOUR_ACTUAL_FIREBASE_APP_ID_FROM_SETTINGS"
REACT_APP_FIREBASE_MEASUREMENT_ID="YOUR_ACTUAL_MEASUREMENT_ID"

# --- Backend API URL (from your deployed Cloud Run service) ---
REACT_APP_BACKEND_URL="[https://your-cloud-run-service-url.a.run.app](https://your-cloud-run-service-url.a.run.app)"
Firebase Console Setup:

Go to your Firebase Console and select your Mini-Project.

In Project settings (gear icon) > General, under "Your apps", copy your web app's firebaseConfig values.

In Build > Authentication > Sign-in method, enable "Email/Password".

In Build > Firestore Database, create a database (start in production mode, choose nam7 or a suitable region). Go to the "Rules" tab and replace the default rules with the provided security rules (see "Brief Note on Security" below) and click "Publish".

c. Run Frontend Locally
Bash

npm start
The application will open in your browser (typically http://localhost:3000).

3. Backend Setup (Node.js App)
Open a new terminal window and navigate into the backend directory:

Bash

cd mini-project/backend
a. Install Dependencies
Bash

npm install
b. Configure Firebase Admin SDK Credentials (.env file)
Firebase Service Account Key:

In your Firebase Console for your Mini-Project, go to Project settings > Service accounts.

Click "Generate new private key". This downloads a JSON file (e.g., your-project-id-firebase-adminsdk-xxxxx-xxxxxxxxxx.json).

Move this downloaded JSON file into your mini-project/backend folder. DO NOT commit this file to Git.

Create/Populate .env: Rename .env.example to .env in your backend folder. Open your downloaded JSON file and copy the project_id, private_key, and client_email values. Paste them into your .env file:

Code snippet

# mini-project/backend/.env
FIREBASE_PROJECT_ID=your-project-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_LONG_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@appspot.gserviceaccount.com
Crucial: Ensure FIREBASE_PRIVATE_KEY is a single-line string with \n replacing actual newlines, or copy the entire content in double quotes. The backend code handles unescaping these.

c. Run Backend Locally
Bash

npm run dev # Uses nodemon for automatic restarts during development
The backend server will start on http://localhost:8080.

🚀 Deployment to Google Cloud
1. Deploy Frontend to Firebase Hosting
a. Install Firebase CLI & Login
Bash

npm install -g firebase-tools
firebase login
b. Initialize Firebase Hosting (in React app root)
Navigate to mini-project (your React app root) and run:

Bash

cd mini-project
firebase init hosting
Select your Mini-Project.

Public directory: build

Configure as single-page app: Y

c. Build React App
Bash

npm run build
d. Deploy Frontend
Bash

firebase deploy --only hosting
This command will provide your Frontend Hosting URL.

2. Deploy Backend to Google Cloud Run
a. Install & Configure Google Cloud CLI (gcloud)
Bash

npm install -g @google-cloud/cli # If not already installed
gcloud auth login
gcloud config set project YOUR_FIREBASE_PROJECT_ID # e.g., mini-project-e570c
b. Enable Cloud Build API & Grant Permissions
Go to Google Cloud Console for your Mini-Project.

Search for "Cloud Build API" and ensure it's "Enabled."

Go to IAM & Admin > IAM.

Identify your Default Compute Engine service account: [PROJECT_NUMBER]-compute@developer.gserviceaccount.com (e.g., 883025382476-compute@developer.gserviceaccount.com).

Grant the following roles to this service account:

Cloud Build Service Account

Storage Admin

Service Account User

Wait 5-10 minutes for permissions to propagate.

d. Build and Push Docker Image
Navigate to your backend folder (mini-project/backend).

Bash

cd mini-project/backend
gcloud builds submit --tag gcr.io/YOUR_FIREBASE_PROJECT_ID/click-tracker-backend
# Example: gcloud builds submit --tag gcr.io/mini-project-e570c/click-tracker-backend
If prompted to enable APIs, type Y.

e. Deploy to Cloud Run
First, prepare your sensitive keys as shell variables for the deploy command:

Bash

# Define the path to your Firebase service account JSON file (in the backend folder)
SERVICE_ACCOUNT_JSON_PATH="./your-project-id-firebase-adminsdk-xxxxx-xxxxxxxxxx.json" # <--- ADJUST THIS FILENAME!

# Extract the private key
PRIVATE_KEY=$(jq -r .private_key "$SERVICE_ACCOUNT_JSON_PATH")

# Extract the client email
CLIENT_EMAIL=$(jq -r .client_email "$SERVICE_ACCOUNT_JSON_PATH")
Then, run the deploy command:

Bash

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

JavaScript

const BACKEND_URL = '[https://your-cloud-run-service-url.a.run.app](https://your-cloud-run-service-url.a.run.app)';
Save src/App.js.

Re-build frontend: cd mini-project && npm run build

Re-deploy frontend: firebase deploy --only hosting

🔗 Live URLs
Once deployed, your application will be accessible at:

Frontend (Firebase Hosting): https://YOUR_FIREBASE_HOSTING_URL.web.app (e.g., https://mini-project-e570c.web.app)

Backend (Cloud Run API): https://YOUR_CLOUD_RUN_SERVICE_URL.a.run.app (e.g., https://click-tracker-backend-xxxxxx-uc.a.run.app)

🔐 Brief Note on Security
Firebase Authentication: Leverages Firebase's robust authentication service for secure user identity management (email/password).

Firestore Security Rules: Implements strict data isolation with rules like allow read, write: if request.auth != null && request.auth.uid == userId;, ensuring users can only access and modify their own click_count data.

Backend API Authentication: The Node.js backend employs the Firebase Admin SDK to verify incoming Firebase ID tokens (admin.auth().verifyIdToken()). This is a critical measure to protect API endpoints, ensuring that only requests from valid, authenticated Firebase users can access the protected /echo-user-info route.

Environment Variables: Sensitive credentials, such as the Firebase Admin SDK private key and client email, are stored securely as environment variables on Cloud Run, rather than being hardcoded or committed to source control.

CORS Configuration: For production deployments, the backend's Cross-Origin Resource Sharing (CORS) policy (app.use(cors({ origin: '*' }));) should be refined to specifically permit requests only from your deployed frontend's URL (e.g., origin: 'https://YOUR_FIREBASE_HOSTING_URL.web.app'). This mitigates risks from unauthorized cross-origin requests.
```
