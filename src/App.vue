<template>
  <div class="splash-pad">
    <header class="splash-pad__header">
      <Clock />
    </header>

    <Suspense><Columns /></Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Columns from './components/Columns.vue';
import Clock from './components/Clock.vue';

export default defineComponent({
  name: 'App',
  components: { Clock, Columns },
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
