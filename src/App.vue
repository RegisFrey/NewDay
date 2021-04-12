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
    alwaysShowOptions: { type: Boolean, default: false },
  }
});
</script>

<style>
/* TODO: embed font */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,800;1,400&display=swap');

/**** Varaibles and theme ****/
:root {
  --font-family: 'Open Sans', sans-serif;
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
  --color-text-inverse-subtle: rgb(148, 148, 148);
  --color-highlight: rgb(242, 87, 21);
  --color-link: #0a86d3;
  --color-link-emph: #0374bb;
  --color-link-inverse: #64bbd3;
  --color-link-bg-hover: #0a86d317;
  --color-warning-subtle: rgba(242, 87, 21, 0.2);
  --color-warning: rgb(242, 87, 21);
}

.nd-theme--dark {
  --color-surface: rgb(30, 30, 30);
  --color-surface-inverse: #dcdcdc;
  --color-surface-transparent: rgba(30, 30, 30, 0);
  --color-linework: rgb(69, 69, 69);
  --color-linework-emphasized: rgb(89, 89, 89);
  --color-text: #c7c7c7;
  --color-text-inverse: #3c3c3c;
  --color-text-subtle: #767676;
  --color-text-inverse-subtle: rgb(169, 169, 169);
  /* --color-highlight: rgb(242, 87, 21); /* fall through to :root */
  --color-link: #0c7d9d;
  --color-link-emph: #25b9e2;
  --color-link-inverse: #1082a2;
  --color-link-bg-hover: #0a86d317;
  --color-warning-subtle: rgba(249, 97, 80, 0.2);
  --color-warning: rgb(249, 97, 80);
}

/**** App Layout ****/
html,
body,
#app,
.nd-root { /* .nd-root defined in AppAsync */
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

/**** Global Styles (hidden text, links, buttons) ****/
.screen-reader-text {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    pointer-events: none;
}

a, .nd-link, .nd-link-button {
  color: var(--color-link);
  text-decoration: underline;
  border: none;
  background: none;
  margin: 0;
  padding: 2px 4px;
}

a:hover, .nd-link:hover {
  color: var(--color-link-emph);
}

.nd-link-button {
  text-decoration: none;
}

.nd-button {
  border: 2px solid var(--color-link);
  color: var(--color-link-emph);
  padding: 8px;
  margin: 4px;
  background: none;
  border-radius: 8px;
}
.nd-button:hover {
  background: var(--color-link-bg-hover);
}

.nd-error {
  background-color: var(--color-warning-subtle);
  color: var(--color-warning);
  padding: 8px;
  border-left: 4px solid var(--color-warning);
  margin-top: 8px;
  font-weight: bold;
  max-width: 300px;
}
.nd-error p {
  font-weight: normal;
}
</style>
