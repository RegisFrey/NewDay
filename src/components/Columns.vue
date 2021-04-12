<template>
  <div class="nd-columns">
    <div
      class="nd-columns__calendar"
      v-if="chromeIdentityIsSupported && !calendarIsHidden"
    >
      <h2 class="nd-columns__heading">
        <a class="nd-columns__calendar-link" href="https://calendar.google.com">
        Today
        </a>
      </h2>
      <Suspense><Calendar /></Suspense>
    </div>

    <div class="nd-columns__todos">
      <h2 class="nd-columns__heading">Todo</h2>
      <Suspense><Todos /></Suspense>
    </div>

    <div class="nd-columns__notes">
      <h2 class="nd-columns__heading">Notes</h2>
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
  chromeIdentityIsSupported,
} from '../state/auth';
import {
  setCalendarVisible,
  getState,
} from '../state/calendar';

export default defineComponent({
  name: 'Layout',
  components: { Todos, Calendar, Notepad },
  async setup() {
    const calendarState = await getState();
    return {
      chromeIdentityIsSupported,
      calendarIsHidden: calendarState.hidden,
      setCalendarVisible,
    };
  },
});
</script>

<style>
.nd-columns {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
}

.nd-columns__calendar {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 3;
  padding-bottom: 0;
}

.nd-columns__todos {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 4;
  padding-bottom: 0;
}

.nd-columns__notes {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 8;
  padding-bottom: 0;
}

.nd-columns__heading {
  text-transform: uppercase;
  font-size: 1rem;
  line-height: 1rem;
  color: var(--color-text-subtle);
}

.nd-columns__calendar-link {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 0;
}
</style>
