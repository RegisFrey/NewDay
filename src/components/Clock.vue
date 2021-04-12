<template>
  <div class="nd-clock">
    <h1>
      <span class="nd-clock__hour">{{ time }}</span>
      <span class="nd-clock__day">{{ day }}</span>
      <span class="nd-clock__date">{{ date }}</span>
    </h1>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'Clock',
  setup() {
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
      now,
      day,
      time,
      date,
    };
  },
});
</script>

<style>
.nd-clock {
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-bottom: 10px;
}

.nd-clock__hour,
.nd-clock__day,
.nd-clock__date {
  display: block;
}

.nd-clock__hour {
  font-size: 4rem;
  line-height: 2.5rem;
}
.nd-clock__day {
  font-size: 3rem;
  line-height: 3rem;
  text-transform: uppercase;
}
.nd-clock__date {
  font-size: 2rem;
  line-height: 2rem;
  color: var(--color-text-subtle);
}
</style>