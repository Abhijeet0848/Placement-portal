# Google Meet Integration Setup Guide

To automatically generate Google Meet links when scheduling interviews, you must configure Google Cloud OAuth credentials and add them to your backend environment variables.

If these environment variables are missing, the system will **automatically fall back to generating Jitsi links**.

## Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown and create a **New Project** (e.g., "Placement Portal").
3. Once created, select the project.

## Step 2: Enable the Calendar API
1. In the left sidebar, navigate to **APIs & Services** > **Library**.
2. Search for **Google Calendar API** and click **Enable**.

## Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**.
2. Choose **External** (or Internal if you have a Google Workspace) and click **Create**.
3. Fill in the required fields (App Name: "Placement Portal", User Support Email, Developer Contact Info).
4. Click **Save and Continue**.
5. On the **Scopes** page, click **Add or Remove Scopes**. Search for and add: `.../auth/calendar.events` (Allows creating calendar events).
6. Click **Save and Continue**.
7. If your app is in "Testing" mode (External), add your own email address under **Test users** so you can authenticate.

## Step 4: Create Credentials (Client ID & Secret)
1. Go to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **OAuth client ID**.
3. Select **Web application** as the Application type.
4. Set the Name (e.g., "Backend Server").
5. Under **Authorized redirect URIs**, add exactly: `http://localhost:5000/oauth2callback`
6. Click **Create**.
7. A modal will pop up with your **Client ID** and **Client Secret**. Copy both of these.

## Step 5: Get a Refresh Token
Since the backend runs automatically, it needs a Refresh Token to generate Meet links without requiring you to log in every time.
I have created a helper script for you.

1. Open `server/scripts/getGoogleToken.js`.
2. Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` at the top of the file with the credentials you just copied.
3. Open a terminal in the `server` folder and run:
   ```bash
   node scripts/getGoogleToken.js
   ```
4. Click the link it generates in your terminal.
5. Log in with your Google account (the one you added as a Test User) and grant permissions.
   *(Note: If Google warns you the app isn't verified, click "Advanced" and proceed anyway since this is your own app).*
6. The page will redirect to `http://localhost:5000/oauth2callback?code=...` and might say "Site can't be reached".
7. Copy the **entire URL** from your browser's address bar and look for the `code=` parameter. 
8. Copy ONLY the text after `code=` (up until `&scope=...` if it exists) and paste it back into your terminal.
9. The script will output your **Refresh Token**.

## Step 6: Update Environment Variables
Open `server/.env` (and your Vercel Environment Variables if deploying) and add:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth2callback
```

Restart your backend server, and you're good to go! Interviews will now generate Google Meet links automatically.
