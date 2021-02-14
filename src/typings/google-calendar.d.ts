export interface GoogleCalendarEventTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  start: GoogleCalendarEventTime;
  end: GoogleCalendarEventTime;
  htmlLink: string;
  // hangoutLink?: string, // prefer conferenceData
  conferenceData?: {
    entryPoints: Array<{ entryPointType: string; uri: string }>;
  };
  summary: string;
  description?: string;
}
