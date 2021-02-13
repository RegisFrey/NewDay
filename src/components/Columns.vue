<template>
  <div class="splash-pad__content">
    <div
      class="splash-pad__calendar"
      v-if="calendarIsSupported && !calendarIsHidden"
    >
      <h2 class="splash-pad__section-head">
        <a href="https://calendar.google.com">
        Today
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
