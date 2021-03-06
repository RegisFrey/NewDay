<template>
  <div class="nd-calendar" v-if="authState === AuthState.Authenticated">
    <div v-if="preparedEvents.length === 0">
      The rest of your day is wide open.
      <!-- TODO:FEATURE? You've got 3 events tomorrow -->
      <!-- TODO:FEATURE? Illustration or effect on the empty state? -->
    </div>
    <div
      v-for="entry in preparedEvents"
      :key="entry.id"
      class="nd-calendar__entry"
      :class="{
        'nd-calendar__entry--now': entry.isSoonOrNow,
      }"
    >
      <b class="nd-calendar__entry__starting-time">
        {{ entry.isAllDay ? entry.title : timeInTimezone(entry.start) }}
        <a :href="entry.calendarLink" class="nd-calendar__link">
          <svg
            class="nd-calendar__icon nd-calendar__icon--link"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"
            ></path>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <!-- Feather - https://github.com/feathericons/feather - Link Alternative 2 - MIT License -->
        </a>
        <a v-if="entry.joinLink" :href="entry.joinLink" class="nd-calendar__link">
          <svg
            class="nd-calendar__icon nd-calendar__icon--video-call"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
          <!-- Feather - https://github.com/feathericons/feather - Video - MIT License -->
        </a>
      </b>
      <p v-if="!entry.isAllDay">{{ entry.title }}</p>
    </div>
  </div>
  <div class="nd-calendar" v-else>
    New Day can display upcoming events from your calendars.

    <div class="nd-calendar__authenticate">
      <button @click="authenticateInteractively()" class="nd-button">
        Connect to Google Calendar
      </button>
      <div class="nd-error" v-if="authError">
        Could not authenticate.
        <p>{{ authErrorMessage }}</p>
      </div>
      or
      <button @click="setCalendarVisible(false)" class="nd-link-button">Hide Calendar Column</button>
    </div>

    
  </div>
</template>

<script lang="ts">
import type { GoogleCalendarEvent } from '../typings/google-calendar';
import { computed, defineComponent } from 'vue';
import { AuthState, authenticateInteractively, getAuthStateAndToken, authError, authErrorMessage } from '../state/auth';
import {
  getState,
  setCalendarVisible,
} from '../state/calendar';
import {
  addMinutes,
  localizeDatetimeToDate,
  timeInTimezone,
} from '../helpers/dates';

interface PreparedEvent {
  title: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  isSoonOrNow: boolean;
  isPast: boolean;
  joinLink?: string;
  calendarLink: string;
}

function prepareEvent(event: GoogleCalendarEvent): PreparedEvent {
  const isAllDay = "date" in event.start;
  
  const start = localizeDatetimeToDate(
    (event.start.dateTime || event.start.date) as string,
  );
  const end = localizeDatetimeToDate(
    (event.end.dateTime || event.end.date) as string,
  );

  // TODO: replace now with a ref on a timer (share with clock?)
  const now = new Date();
  const almostNow = addMinutes(now, 10);


  const isPast = now >= end;
  const isSoonOrNow = !isAllDay && start <= almostNow && !isPast;

  const joinLink = event.conferenceData?.entryPoints.find(
    (entry) => entry.entryPointType === 'video',
  )?.uri;

  return {
    title: event.summary,
    start,
    end,
    isAllDay,
    isSoonOrNow,
    isPast,
    joinLink,
    calendarLink: event.htmlLink,
  };
}

function partition <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    return array.reduce(
      (accumulator, item) => predicate(item)
        ? (accumulator[0].push(item), accumulator)
        : (accumulator[1].push(item), accumulator)
      , [[], []] as [T[], T[]]);
}

export default defineComponent({
  async setup() {
    const state = await getState();

    const preparedEvents = computed(() => {
      // Change format to our UI and data needs
      const preparedEvents = state.events.value.map(prepareEvent)
      // Split out all day events
      let [ allDayEvents, upcomingEvents ] = partition(preparedEvents, e => e.isAllDay)
      // Remove past events
      upcomingEvents = upcomingEvents.filter(e => !e.isPast)
      // Put into a new ordering
      return [...allDayEvents, ...upcomingEvents];
    })

    const { authState } = await getAuthStateAndToken();

    return {
      // Calendar
      ...state,
      preparedEvents,
      setCalendarVisible,  
      timeInTimezone,
      // Auth
      authenticateInteractively,
      AuthState,
      authState,
      authError,
      authErrorMessage
    };
  },
});
</script>

<style>
.nd-calendar__entry {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-linework);
  padding-bottom: 8px;
}

.nd-calendar__entry__starting-time {
  font-size: 1.5rem;
}

.nd-calendar__entry--now {
  color: var(--color-warning);
}

.nd-calendar__link {
  padding: 0 8px;
}

.nd-calendar__icon {
  width: 24px;
  height: 24px;
  stroke: var(--color-text-subtle);
  vertical-align: middle;
}

.nd-calendar__authenticate {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
}
</style>
