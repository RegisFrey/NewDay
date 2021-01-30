/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Ref } from 'vue';
import { useStorageValue } from '../helpers/storage';

export const calendarIsSupported = window && 'chrome' in window && 'identity' in window.chrome;

let events: Ref<unknown>;
let authenticated: Ref<boolean>;
let hidden: Ref<boolean>;
let oauthToken: Ref<string>;


export async function getState () {

  events = await useStorageValue<string>('events', '');
  hidden = await useStorageValue<boolean>('calendarHidden', false);
  authenticated = await useStorageValue<boolean>('authenticated', false);
  oauthToken = await useStorageValue<string>('token', '');

  await authenticateForCalendar();

  // if (!hidden.value && authenticated.value) {
    // updateCalendar();
  // }
  
  return {
    events,
    authenticated,
    hidden,
    oauthToken
  }
}

export async function authenticateForCalendar (interactive = false) {
  if (calendarIsSupported) {
    chrome.identity.getAuthToken({ interactive }, function(token) {
      if (token) {
        authenticated.value = true;
        oauthToken.value = token;
      } else {
        authenticated.value = false;
      }
    })
  }
}

export async function updateCalendar () {
  const headers = new Headers({
    'Authorization' : 'Bearer ' + oauthToken,
    'Content-Type': 'application/json'
  })

  const queryParams = { headers };

  fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', queryParams)
    .then(response => response.json()) // Transform the data into json
    .then(data => {
      console.log(data);
    })
}

export function setCalendarVisible (visible: boolean) {
  hidden.value = !visible;
}