<template>
<Suspense>
  <Options
    :class="{
      'nd-theme--light': theme == ThemePreference.Light,
      'nd-theme--dark': theme == ThemePreference.Dark 
    }"
    class="nd-root"
    @close="showOptions = false"
    :showOptions="showOptions"
    :canClose="!alwaysShowOptions"
    >
    <header class="nd__header">
      <Clock />
      <button class="nd-options-button" @click="showOptions = !showOptions">
          <svg
              class="nd-icon__options"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var()"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span class="screen-reader-text">Options</span>
      </button>
    </header>
    <Columns />
  </Options>
</Suspense>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Columns from './components/Columns.vue';
import Clock from './components/Clock.vue';
import Options from './components/Options.vue';
import { getResolvedTheme, ThemePreference } from './state/theme';

export default defineComponent({
  name: 'AppAsync',
  components: { Clock, Columns, Options },
  props: {
    alwaysShowOptions: Boolean,
  },
  async setup (props) {
    const showOptions = ref(props.alwaysShowOptions || false)
    let theme = await getResolvedTheme();
    return { showOptions, theme, ThemePreference }
  },
});
</script>

<style>
.nd-root {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/*
This is the button to trigger the options
(no __ because in this case it is owned by App not options)
*/
.nd-options-button {
    border: none;
    background: transparent;
    padding: 20px;
    position: absolute;
    top: 0;
    right: 0;
}
.nd-options-button:focus {
    outline: none;
}
.nd-options-button:focus > svg {
    stroke: var(--color-link);
}
.nd-icon__options {
  width: 24px;
  height: 24px;
  stroke: var(--color-text-subtle);
}
</style>