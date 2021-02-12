/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { GoogleCalendarEvent } from '../typings/google-calendar';
import { Ref } from 'vue';
import { addHours, addMinutes } from '../helpers/dates';
import { useStorageValue } from '../helpers/storage';

/*
interface SavedEvent  {
  title: string;
  start: Date; // Keep timestamp data
  end: Date; // Keep timestamp data
  joinLink?: string,
  calendarLink: string,
}

interface PreparedEvent extends SavedEvent {
  localizedStart: Date;
  localizedEnd: Date;
  isNow: boolean;
  isPast: boolean;
}
*/

export const calendarIsSupported =
  window && 'chrome' in window && 'identity' in window.chrome;

let events: Ref<Array<GoogleCalendarEvent>>;
let eventsCachedAt: Ref<Date>;
let authenticated: Ref<boolean>;
let hidden: Ref<boolean>;
let oauthToken: Ref<string>;

export async function getState() {
  events = await useStorageValue<Array<GoogleCalendarEvent>>('events', []);
  eventsCachedAt = await useStorageValue<Date>('eventsCachedAt', new Date(0));
  hidden = await useStorageValue<boolean>('calendarHidden', false);
  authenticated = await useStorageValue<boolean>('authenticated', false);
  oauthToken = await useStorageValue<string>('token', '');

  await authenticateForCalendar();

  return {
    events,
    authenticated,
    hidden,
    oauthToken,
  };
}

export async function authenticateForCalendar(interactive = false) {
  if (calendarIsSupported) {
    chrome.identity.getAuthToken({ interactive }, function (token) {
      if (token) {
        authenticated.value = true;
        oauthToken.value = token;
        updateCalendar();
      } else {
        authenticated.value = false;
        // TODO: Show error in UI? e.g. in settings or on first auth.
      }
    });
  }
}

async function updateCalendar() {
  if (authenticated) {
    const now = new Date();
    if (now > addMinutes(eventsCachedAt.value, 0)) {
      const headers = new Headers({
        Authorization: 'Bearer ' + oauthToken.value,
        'Content-Type': 'application/json',
      });

      // https://developers.google.com/calendar/v3/reference/events/list
      const calendarEventsListEndpoint = new URL(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      );
      const apiParameters = {
        // we only care about the next few events from now to ~8hrs from now
        timeMin: now.toISOString(),
        timeMax: addHours(now, 8).toISOString(),
        maxResults: '8',
        singleEvents: 'true', // expand recurring events to instances
        orderBy: 'startTime', // requires singleEvents: true
      };
      calendarEventsListEndpoint.search = new URLSearchParams(
        apiParameters,
      ).toString();

      fetch(calendarEventsListEndpoint.toString(), { headers })
        .then((response) => response.json()) // Transform the data into json
        .then((data) => {
          eventsCachedAt.value = new Date();
          events.value = data.items;
        });
    } else {
      console.log('Using cached events.');
    }
  } else {
    console.log("Calendar couldn't update. Not autheticated");
  }
}

/** Export a debounced function to avoid hitting the google api too often */
// export const updateCalendar = debounce(_updateCalendar, minutesInMs(5))

export function setCalendarVisible(visible: boolean) {
  hidden.value = !visible;
}
