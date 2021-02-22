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
    
    <button @click="$emit('close')" v-if="canClose">Close Options</button>

    <div
      class="nd-options__app-thumbnail"
      ref="thumbnailTarget"
      :style="{ height: thumbnailHeight + 'px'}"
      />

    <div class="nd-options__columns">

      <div class="nd-options__column">
        <h1>Theme</h1>
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

      <div class="nd-options__column">
        <h1>Calendar</h1>
        
        <label>
          <input type="checkbox" />
          Show Calendar Column
        </label>
      </div>
    
    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useElementBoundingWithPosition } from '../helpers/useElementBoundingWithPosition'
// import { useElementBounding } from '@vueuse/core' (switched to custom one with position)

// async stuff within setup?
export default defineComponent({
  props: {
    showOptions: { type: Boolean, default: false },
    canClose: { type: Boolean, default: true },
  },
  setup(props) {
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
      // const scaleXInverse =  appWidth / thumbWidth;
      const scaleY = thumbHeight / appHeight;
      // const scaleYInverse = appHeight / thumbHeight;
      const translateX = (thumbLeft - appLeft);// * scaleXInverse;
      const translateY = (thumbTop - appTop);// * scaleYInverse;

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

    return { thumbnailTarget, thumbnailClientRect, appContainer, appClientRect, transform, thumbnailHeight }
  },
});
</script>

<style>
.nd-options {
  --options-transition-time: 1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nd-options__columns {
  padding-right: 20px;
}

.nd-options__app-scale,
.nd-options__app-translate {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: top left;
}

.nd-options__app-translate {
  transition: transform var(--options-transition-time) ease-in-out;
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
  transition: border-color var(--options-transition-time), transform var(--options-transition-time) ease-in-out;
}
.nd-options__app-scale--active {
  border-color: var(--color-linework-emphasized);
}

.nd-options__app-thumbnail {
  width: 30%;
  margin: 20px;
}
</style>
