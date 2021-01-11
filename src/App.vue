<template>
  <div class="splash-pad">
    <header class="splash-pad__header">
      <div class="splash-pad__today">
        <h1>
          <span class="splash-pad__hour">{{ time }}</span>
          <span class="splash-pad__day">{{ day }}</span>
          <span class="splash-pad__date">{{ date }}</span>
        </h1>
      </div>
    </header>

    <div class="splash-pad__content">
      <div class="splash-pad__calendar">
        <h2 class="splash-pad__section-head">Today</h2>
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
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {
  defineComponent,
  computed,
  ref,
} from 'vue';
import Todos from './components/Todos.vue';
import Calendar from './components/Calendar.vue';
import Notepad from './components/Notepad.vue';

export default defineComponent({
  name: 'App',
  components: { Todos, Calendar, Notepad },
  setup() {
    // TIME
    const now = ref(new Date());

    const day = computed(() =>
      new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now.value),
    );
    const time = computed(() =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(now.value),
    );
    const date = computed(() =>
      // @ts-ignore: https://github.com/microsoft/TypeScript/issues/38266
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(now.value),
    );

    /* Setup update loop on the minute */
    const secondsRemainingInMinute = (60 - now.value.getSeconds()) * 1000;

    function updateTime() {
      now.value = new Date();
    }

    setTimeout(() => {
      updateTime();
      setInterval(() => {
        updateTime();
      }, 60000);
    }, secondsRemainingInMinute);

    return {
      // time and date
      now,
      day,
      time,
      date,
    };
  },
});
</script>

<style>
.splash-pad {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.splash-pad__content {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
}

.splash-pad__today {
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-bottom: 10px;
}

.splash-pad__calendar {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 3;
  padding-bottom: 0;
}

.splash-pad__todos {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 3;
  padding-bottom: 0;
  
}

.splash-pad__notes {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 7;
  padding-bottom: 0;
}

.splash-pad__hour,
.splash-pad__day,
.splash-pad__date {
  display: block;
}

.splash-pad__hour {
  font-size: 4rem;
  line-height: 2.5rem;
}
.splash-pad__day {
  font-size: 3rem;
  line-height: 3rem;
  text-transform: uppercase;
}
.splash-pad__date {
  font-size: 2rem;
  line-height: 2rem;
  color: var(--color-text-subtle);
}

.splash-pad__section-head {
  text-transform: uppercase;
  font-size: 1rem;
  line-height: 1rem;
  color: var(--color-text-subtle);
}

a {
  color: var(--color-link);
}
</style>
