import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:8855/auth/google/callback'  // Make sure this matches exactly in Google Cloud Console
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.events'
        ],
        include_granted_scopes: true,
        response_type: 'code',
        prompt: 'consent'
    });
}

export async function createCalendarEvent(event, auth) {
    try {
        oauth2Client.setCredentials(auth);
        
        // Validate event data
        if (!event.start?.dateTime || !event.end?.dateTime) {
            console.error('Invalid event data:', event);
            throw new Error('Invalid event data: missing start or end time');
        }

        const response = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            requestBody: {
                ...event,
                reminders: {
                    useDefault: true
                }
            },
        });
        
        return response.data;
    } catch (error) {
        console.error('Calendar API Error:', error);
        throw error;
    }
}
