<template>
  <div class="splash-pad__content">
    <div
      class="splash-pad__calendar"
      v-if="calendarIsSupported && !calendarIsHidden"
    >
      <h2 class="splash-pad__section-head">
        <a href="https://calendar.google.com">
        Today
        <!--
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style="stroke: var(--color-text-subtle)"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <!-/- Feather - https://github.com/feathericons/feather - Calendar - MIT License -/->
        -->
        </a>
      </h2>
      <Suspense><Calendar /></Suspense>
    </div>

    <div class="splash-pad__todos">
      <h2 class="splash-pad__section-head">Todo</h2>
      <Suspense><Todos /></Suspense>
    </div>

    <div class="splash-pad__notes">
      <h2 class="splash-pad__section-head">Notes</h2>
      <Suspense><Notepad /></Suspense>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { defineComponent } from 'vue';
import Todos from './Todos.vue';
import Calendar from './Calendar.vue';
import Notepad from './Notepad.vue';
import {
  setCalendarVisible,
  getState,
  calendarIsSupported,
} from '../state/calendar';

export default defineComponent({
  name: 'Layout',
  components: { Todos, Calendar, Notepad },
  async setup() {
    const calendarState = await getState();
    return {
      calendarIsSupported,
      calendarIsHidden: calendarState.hidden,
      calendarIsAuthenticated: calendarState.authenticated,
      setCalendarVisible,
    };
  },
});
</script>

<style>
h2 > a {
  display: block;
  color: inherit;
  text-decoration: none;
}
</style>
