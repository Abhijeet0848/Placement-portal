const { google } = require('googleapis');
const readline = require('readline');

// Replace these with the credentials from your Google Cloud Console
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:5000/oauth2callback'; // Make sure this is added to Authorized redirect URIs in Google Cloud Console

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// We need the Calendar scope to create Google Meet links
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent', // Force consent screen to ensure we get a refresh token
});

console.log('Authorize this app by visiting this url:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      return console.error('Error retrieving access token', err);
    }
    console.log('\n--- SUCCESS! ---');
    console.log('Copy the following Refresh Token into your .env file:');
    console.log('GOOGLE_REFRESH_TOKEN=' + token.refresh_token);
    console.log('\nAlso add your client ID and secret to the .env file:');
    console.log('GOOGLE_CLIENT_ID=' + CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET=' + CLIENT_SECRET);
  });
});
