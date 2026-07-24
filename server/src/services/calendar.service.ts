import { google } from 'googleapis';
import logger from '../utils/logger';

// OAuth2 Setup
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/oauth2callback';

let oauth2Client: any = null;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
  try {
    oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
    logger.info('Initialized Google Calendar API Client successfully.');
  } catch (err) {
    logger.warn('Failed to initialize Google Calendar API Client: ' + err);
  }
} else {
  logger.warn('Google OAuth credentials missing. Falling back to Jitsi / generic links for interviews.');
}

/**
 * Creates a Google Calendar event with a Google Meet link attached.
 * 
 * @param jobTitle The title of the job
 * @param companyName The name of the company
 * @param studentName The student's name
 * @param studentEmail The student's email (optional, to invite them)
 * @param date The date string (e.g. 2026-07-24)
 * @param time The time string (e.g. 15:30)
 * @returns {Promise<string>} The generated hangoutLink (Google Meet URL)
 */
export async function createGoogleMeetEvent(
  jobTitle: string,
  companyName: string,
  studentName: string,
  studentEmail: string,
  date: string,
  time: string
): Promise<string> {
  if (!oauth2Client) {
    // Fallback if credentials aren't set
    const roomCode = Math.random().toString(36).substring(2, 10);
    return `https://meet.jit.si/PlacementPortal-${roomCode}`;
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Parse start time
    const startDateTime = new Date(`${date}T${time}:00`);
    
    // Default to 1 hour duration
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Interview: ${studentName} - ${jobTitle} at ${companyName}`,
      description: `Automated interview schedule for ${studentName}.`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC', // Ensure timezones are correctly handled
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: studentEmail ? [{ email: studentEmail }] : [],
      conferenceData: {
        createRequest: {
          requestId: `interview-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
    });

    return response.data.hangoutLink || `https://meet.jit.si/PlacementPortal-Fallback`;
  } catch (error: any) {
    logger.error('Error creating Google Meet event: ' + error.message);
    // Graceful fallback to Jitsi if Calendar API fails
    const roomCode = Math.random().toString(36).substring(2, 10);
    return `https://meet.jit.si/PlacementPortal-${roomCode}`;
  }
}
