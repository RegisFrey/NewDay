/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { GoogleCalendarEvent } from '../typings/google-calendar';
import { ref } from 'vue';
import { addHours, addMinutes } from '../helpers/dates';
import { useStorageValue } from '../helpers/storage';
import { debounce, DebounceMode } from '../helpers/debounce';
import { AuthState, getAuthStateAndToken, onTokenRejected, registerAuthenticatedCallback } from './auth';

let state = {
  events: ref<Array<GoogleCalendarEvent>>([]),
  eventsCachedAt: ref(new Date(0)),
  hidden: ref(true),
}

let stateInitialized = false;

export async function getState() {
  if (!stateInitialized) {
    state.events = await useStorageValue<Array<GoogleCalendarEvent>>('events', state.events.value, state.events)
    state.eventsCachedAt = await useStorageValue<Date>('eventsCachedAt', state.eventsCachedAt.value, state.eventsCachedAt)
    // Instead of using the uninitialized default for hidden
    // we will default the state to false if the storage value doesn't exist.
    // The result is we default to hiding calendar when app loads
    // then if user has a preference we show it
    // If they haven't yet set (e.g. first run) we default to showing.
    state.hidden = await useStorageValue<boolean>('calendarHidden', false, state.hidden)
  }
  stateInitialized = true;
  // and we update the calendar to fetch events
  updateCalendar(); // NOTE: subsequent calls will be ignored during debounce timeout (~1 minute) (see `updateCalendar = debounce`)
  return state;
}

async function _updateCalendar(force = false) {
  const { authState, token } = await getAuthStateAndToken();
  if (authState.value === AuthState.Authenticated) {
    const now = new Date();
    const cachedUntil = addMinutes(state.eventsCachedAt.value, 1);
    const pastCacheExpiration = now > cachedUntil;
    console.debug(`Checking if ${now} is greater than ${cachedUntil} (${pastCacheExpiration ? 'It is' : 'It\'s not'})`);
    if (force || pastCacheExpiration) {
      console.debug('Actually updating calendar');
      const headers = new Headers({
        Authorization: 'Bearer ' + token.value,
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
          if (response.ok) {
            return response;
          } else if (response.status === 401) {
            onTokenRejected();
            throw new Error('Server Rejected Authentication Token');
          } else {
            throw new Error('Bad Response: ' + response.text() );
            // 403 for exceeded requests (user or api)
            // 403 for no API token sent with request (never should happen)
          }
        })
        .then((response) => response.json()) // Transform the data into json
        .then((data) => {
          state.eventsCachedAt.value = new Date();
          state.events.value = data.items;
          console.debug('Fetched and set new events.');
        })
        .catch((error) => {
          throw new Error('Could not set event data');
        });
    } else {
      console.debug('Using cached events.');
    }
  } else {
    console.debug("Calendar couldn't update. Not authenticated");
  }
}

/** Export a debounced function to avoid stacking multiple access calls and errors */
export const updateCalendar = debounce(_updateCalendar, 1000, DebounceMode.FirstThenIgnoreForTimeout);

// But do force an update of calendar when first authenticating
registerAuthenticatedCallback(() => { _updateCalendar(true); })

export function setCalendarVisible(visible: boolean) {
  state.hidden.value = !visible;
}
