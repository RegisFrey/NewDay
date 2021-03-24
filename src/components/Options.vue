<template>
  <div class="nd-options" ref="appContainer">
    <div
      class="nd-options__app-translate"
      :class="{ 'nd-options__app-translate--active': showOptions }"
      :style="{ transform: transform.translate }">
      <div
        class="nd-options__app-scale"
        :class="{ 'nd-options__app-scale--active': showOptions }"
        :style="{ transform: transform.scale }"
        >
          <slot></slot>
      </div>
    </div>
    
    <button @click="$emit('close')" v-if="canClose" class="nd-link-button">Close Options</button>

    <div
      class="nd-options__app-thumbnail"
      ref="thumbnailTarget"
      :style="{ height: thumbnailHeight + 'px'}"
      />

    <div class="nd-options__groups">

      <div class="nd-options__group">
        <h1>Theme</h1>
        <label for="theme-light">
          <input
            type="radio"
            id="theme-light"
            name="theme"
            :value="ThemePreference.Light"
            :checked="themePreference === ThemePreference.Light"
            @change="themePreference = ThemePreference.Light"
            />
          Light
        </label>

        <label for="theme-dark">
          <input
            type="radio"
            id="theme-dark"
            name="theme"
            :value="ThemePreference.Dark"
            :checked="themePreference === ThemePreference.Dark"
            @change="themePreference = ThemePreference.Dark"
            />
          Dark
        </label>

        <label for="theme-dark">
          <input
            type="radio"
            id="theme-by-system"
            name="theme"
            :value="ThemePreference.BySystemSetting"
            :checked="themePreference === ThemePreference.BySystemSetting"
            @change="themePreference = ThemePreference.BySystemSetting"
            />
          By System Setting
        </label>
      </div>

      <div class="nd-options__group">
        <h1>Calendar</h1>
        <template v-if="calendarIsSupported">
          <label>
            <input type="checkbox" :checked="!calendar.hidden.value" @change="setCalendarVisible(calendar.hidden.value)" />
            Show Calendar Column
          </label>
          <br/>
          <template v-if="authState === AuthState.Authenticated">
            <button class="nd-button" @click="deauthenticate()">Disconnect from Google Calendar</button> 
          </template>
          <template v-else>
            <button class="nd-button" @click="authenticateInteractively()">Connect to Google Calendar</button>
            <div class="nd-error" v-if="authState === AuthState.Error">
              Could not authenticate.
            </div>
          </template> 
        </template>
        <template v-else>
          Calendar display relies on features not available in this browser.
        </template>
      </div>

      <div class="nd-options-details">
        Icons from <a href="https://feathericons.com/">Feather</a> under the MIT license.
      </div>
    
    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useElementBoundingWithPosition } from '../helpers/useElementBoundingWithPosition'
import {
      setCalendarVisible,
      getState as getCalendarState,
      calendarIsSupported,
      authenticateForCalendar,
      deauthenticate
} from '../state/calendar';
import { ThemePreference, getResolvedTheme, getThemePreference } from '../state/theme'

export default defineComponent({
  props: {
    showOptions: { type: Boolean, default: false },
    canClose: { type: Boolean, default: true },
  },
  async setup(props) {
    const calendarState = await getCalendarState();
    const themePreference = await getThemePreference();
    const theme = await getResolvedTheme();

    const thumbnailTarget = ref(null)
    const thumbnailClientRect = useElementBoundingWithPosition(thumbnailTarget)
    const appContainer = ref(null)
    const appClientRect = useElementBoundingWithPosition(appContainer)

    const appHeightRatio = computed(() => {
      return appClientRect.height.value / appClientRect.width.value;
    })

    const thumbnailHeight = computed(() => appHeightRatio.value * thumbnailClientRect.width.value)

    const transform = computed(() => {
      const thumbLeft = thumbnailClientRect.left.value;
      const thumbTop = thumbnailClientRect.top.value;
      const thumbWidth = thumbnailClientRect.width.value;
      const thumbHeight = thumbnailHeight.value;

      const appLeft = appClientRect.left.value;
      const appTop = appClientRect.top.value;
      const appWidth = appClientRect.width.value;
      const appHeight = appClientRect.height.value;

      const scaleX = thumbWidth / appWidth;
      const scaleY = thumbHeight / appHeight;
      const translateX = (thumbLeft - appLeft);
      const translateY = (thumbTop - appTop);

      if (props.showOptions) {
        return {
          scale: `scale(${scaleX}, ${scaleY})`,
          translate: `translate(${translateX}px, ${translateY}px)`,
        }
      } else {
        return {
          scale: `scale(1, 1)`,
          translate: `translate(0px, 0px)`,
        } 
      }
    })

    return {
      thumbnailTarget, thumbnailClientRect, thumbnailHeight,
      appContainer, appClientRect,
      transform,
      // CALENDAR
      setCalendarVisible, // TODO: Debounce
      calendar: calendarState,
      calendarIsSupported,
      authenticateForCalendar,
      deauthenticate,
      // THEME
      ThemePreference,
      themePreference,
      theme,
    }
  },
});
</script>

<style>
.nd-options {
  --options__transition-time: 1s;
  --options__z-app: 20;
  --options__z-options: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nd-options__group {
  display: flex;
  flex-direction: column;
}

.nd-options__group h1 {
  margin-bottom: 4px;
}

.nd-options__groups {
  padding-right: 20px;
  position: relative;
  z-index: var(--options__z-options);
}

.nd-options__app-scale {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nd-options__app-scale,
.nd-options__app-translate {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: top left;
  z-index: var(--options__z-app); 
}

.nd-options__app-translate {
  transition: transform var(--options__transition-time) ease-in-out;
  overflow: visible;
}
.nd-options__app-translate--active {
  pointer-events: none;
  user-select: none;
}

.nd-options__app-scale {
  overflow: hidden;
  background-color: var(--color-surface);
  box-shadow: 0 0 25px 10px var(--color-linework); 
  border: 1px solid rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  transition: border-color var(--options__transition-time), transform var(--options__transition-time) ease-in-out;
}
.nd-options__app-scale--active {
  border-color: var(--color-linework-emphasized);
}

.nd-options__app-thumbnail {
  width: 30%;
  margin: 20px;
}

.nd-options-details {
    padding-top: 10px;
    opacity: 0.5;
    border-top: 1px solid var(--color-linework);
    margin-top: 20px;
}
</style>
