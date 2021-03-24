/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { GoogleCalendarEvent } from '../typings/google-calendar';
import { nextTick, ref, Ref } from 'vue';
import { addHours, addMinutes, minutesInMs } from '../helpers/dates';
import { useStorageValue } from '../helpers/storage';
import { debounce } from '../helpers/debounce';

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

let state:
  | {
      events: Ref<Array<GoogleCalendarEvent>>;
      eventsCachedAt: Ref<Date>;
      hidden: Ref<boolean>;
    }
  | undefined;

export async function getState() {
  if (state) {
    return state;
  } else {
    state = {
      events: await useStorageValue<Array<GoogleCalendarEvent>>('events', []),
      eventsCachedAt: await useStorageValue<Date>(
        'eventsCachedAt',
        new Date(0),
      ),
      hidden: await useStorageValue<boolean>('calendarHidden', false),
    };

    updateCalendar();
  }

  return state;
}

async function _updateCalendar() {
  // if authState === AuthState.Authenticated && token !== ""

  if (state?.authenticated.value) {
    const now = new Date();
    if (now > addMinutes(state.eventsCachedAt.value, 0)) {
      const headers = new Headers({
        Authorization: 'Bearer ' + state.oauthToken.value,
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
        .then((response) => {
          console.log('calendar response', response);
          if (response.ok) {
            return response;
          } else if (response.status === 401) {
            tokenRejected();
            throw new Error('Server Rejected Authentication Token');
          } else {
            throw new Error('Bad Response');
            // 403 for exceeded requests (user or api)
            // 403 for no API token sent with request (never should happen)
          }
        })
        .then((response) => response.json()) // Transform the data into json
        .then((data) => {
          if (state) {
            state.eventsCachedAt.value = new Date();
            state.events.value = data.items;
          }
        });
    } else {
      console.log('Using cached events.');
    }
  } else {
    console.log("Calendar couldn't update. Not authenticated");
  }
}

/** Export a debounced function to avoid hitting the google api too often */
export const updateCalendar = debounce(_updateCalendar, minutesInMs(0.1));

export function setCalendarVisible(visible: boolean) {
  if (state) state.hidden.value = !visible;
}
