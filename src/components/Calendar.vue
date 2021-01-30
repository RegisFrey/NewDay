<template>
<div class="splash-pad-calendar">
  <div
    v-for="entry in []"
    :key="entry.id"
    class="splash-pad__calendar__entry" 
    :class="{ 'splash-pad__calendar__entry--now': false }"
    >
    <b class="splash-pad__start__time">{{ entry.start_time }}<!-- 3:20 PM --></b>
    {{ entry.name }}
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getState, setCalendarVisible, authenticateForCalendar } from '../state/calendar';

export default defineComponent({
  async setup() {
    // const { calendarData, authenticated, hidden, oauthToken } = await getState();
    const state = await getState();

    return {
      ...state,
      setCalendarVisible,
      authenticateForCalendar
    }
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
  border-bottom: 1px solid var(--color-linework);
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.splash-pad__calendar__entry--now {
  color: var(--color-warning)
}
</style>