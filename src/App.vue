<template>
<Suspense>
  <AppAsync :alwaysShowOptions="alwaysShowOptions" />
</Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppAsync from './AppAsync.vue';

export default defineComponent({
  name: 'App',
  components: { AppAsync },
  props: {
    alwaysShowOptions: Boolean,
  },
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,800;1,400&display=swap');

:root {
  --font-family: 'Open Sans', sans-serif;
}

html,
body,
#app,
.splash-pad {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-family);
  box-sizing: border-box;
}

:root, .nd-theme--light {
  --color-surface: #f4f0f1;
  --color-surface-inverse: rgb(30, 30, 30);
  --color-surface-transparent: #f4f0f100;
  --color-linework: #dcdcdc;
  --color-linework-emphasized: #d3d3d3;
  --color-text: #716e6d;
  --color-text-inverse: #c7c7c7;
  --color-text-subtle: #969595;
  --color-highlight: rgb(242, 87, 21);
  --color-link: #0a86d3;
  --color-warning: rgb(242, 87, 21);
}

.nd-theme--dark {
  --color-surface: rgb(30, 30, 30);
  --color-surface-transparent: rgba(30, 30, 30, 0);
  --color-linework: rgb(69, 69, 69);
  --color-linework-emphasized: rgb(89, 89, 89);
  --color-text: #c7c7c7;
  --color-text-subtle: #767676;
  --color-link: #0c7d9d;
  --color-warning: rgb(249, 97, 80);
}

.splash-pad {
  display: flex;
  flex-direction: column;
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
