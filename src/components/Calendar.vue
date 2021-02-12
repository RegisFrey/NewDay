<template>
  <div class="splash-pad-calendar" v-if="authenticated">
    <div v-if="preparedEvents.length === 0">
      The rest of your day is wide open.
      <!-- TODO:FEATURE? You've got 3 events tomorrow -->
      <!-- TODO:FEATURE? art or effect on the empty state? -->
    </div>
    <div
      v-for="entry in preparedEvents"
      :key="entry.id"
      class="splash-pad__calendar__entry"
      :class="{
        'splash-pad__calendar__entry--now': entry.isSoonOrNow,
      }"
    >
      <b class="splash-pad__start__time">
        {{ timeInTimezone(entry.start) }}
        <a :href="entry.calendarLink" style="padding: 8px;">
          <svg
            style="stroke: var(--color-text-subtle)"
            width="24"
            height="24"
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
          <!-- Feather - https://github.com/feathericons/feather - Link Alterante 2 - MIT License -->
        </a>
        <a v-if="entry.joinLink" :href="entry.joinLink" style="padding: 8px;">
          <svg
            style="stroke: var(--color-text-subtle)"
            width="24"
            height="24"
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
      <p>{{ entry.title }}</p>
      <!-- link? to view on calendar / to join video call? both zoom and hangouts links? -->
    </div>
  </div>
  <div class="splash-pad-calendar splash-pad-calendar--authenticate" v-else>
    New Day can display upcoming events from your calendars.

    <button @click="authenticateForCalendar(true)">
      Connect to Google Calendar
    </button>
    or
    <button @click="setCalendarVisible(false)">Hide Calendar Column</button>
  </div>
</template>

<script lang="ts">
import type { GoogleCalendarEvent } from '../typings/google-calendar';
import { defineComponent } from 'vue';
import {
  getState,
  setCalendarVisible,
  authenticateForCalendar,
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
  isSoonOrNow: boolean;
  isPast: boolean;
  joinLink?: string;
  calendarLink: string;
}

function prepareEvent(event: GoogleCalendarEvent): PreparedEvent {
  const start = localizeDatetimeToDate(
    event.start.dateTime,
    // event.start.timeZone, // (why does it not work when this is passed in? I'm doing something dumb but to sleep deprived to fix it now.)
  );
  const end = localizeDatetimeToDate(
    event.end.dateTime,
    // event.end.timeZone,
  );
  const now = new Date();
  const almostNow = addMinutes(now, 10);

  // TODO: replace now with a ref on a timer (share with clock?)

  const isPast = now >= end;
  const isSoonOrNow = start <= almostNow && !isPast;

  const joinLink = event.conferenceData?.entryPoints.find(
    (entry) => entry.entryPointType === 'video',
  )?.uri;

  return {
    title: event.summary,
    start,
    end,
    isSoonOrNow,
    isPast,
    joinLink,
    calendarLink: event.htmlLink,
  };
}

export default defineComponent({
  async setup() {
    const state = await getState();

    return {
      ...state,
      preparedEvents: state.events.value
        .map(prepareEvent)
        .filter((e) => !e.isPast),
      setCalendarVisible,
      authenticateForCalendar,
      timeInTimezone,
    };
  },
});
</script>

<style>
.splash-pad__start__time {
  font-size: 1.5rem;
}

.splash-pad__calendar__entry {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-linework);
  padding-bottom: 8px;
}

.splash-pad__calendar__entry--now {
  color: var(--color-warning);
}
</style>
