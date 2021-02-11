<template>
  <div class="splash-pad-settings">
    <h2>
      <label>
        <input type="checkbox" />
        Show Events Column
      </label>
    </h2>

    <h2>Theme</h2>
    <label for="theme-light">
      <input type="radio" id="theme-light" name="theme" value="light" />
      Light
    </label>

    <label for="theme-dark">
      <input type="radio" id="theme-dark" name="theme" value="dark" />
      Dark
    </label>

    <label for="theme-dark">
      <input type="radio" id="theme-system" name="theme" value="system" />
      By System Setting
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  async setup() {},
});
</script>

<style></style>
