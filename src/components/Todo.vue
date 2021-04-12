<template>
  <transition name="nd-todo">
    <label
      class="nd-todo"
      :class="{ 'nd-todo--checked': completed }"
    >
      <span
        class="nd-todo__checkbox"
        :class="{ 'nd-todo__checkbox--checked': completed }"
      />
      <input type="checkbox" :checked="completed" @change="changeChecked" />

      <div class="nd-todo__description-container">
        <textarea
          contenteditable="true"
          class="nd-todo__description"
          :value="title"
          @input="changeTitle"
          placeholder="What to do?"
          ref="todoInput"
          wrap="soft"
        />
        <div
          aria-hidden="true"
          class="nd-todo__description-force-size"
        >
          {{ title }}
        </div>
      </div>
    </label>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    completed: Boolean,
    title: String,
  },
  methods: {
    changeChecked(event: InputEvent) {
      this.$emit(
        'update:completed',
        (event.target as HTMLInputElement).checked ? new Date() : false,
      );
    },
    changeTitle(event: InputEvent) {
      this.$emit('update:title', (event.target as HTMLInputElement).value);
    },
    focusInput() {
      (this.$refs.todoInput as HTMLInputElement).focus();
    },
  },
});
</script>

<style>
.nd-todo {
  display: flex;
  margin-bottom: 8px;
}
.nd-todo__description-container {
  position: relative;
  min-height: 0;
  flex: 1;
  width: 100%;
}

/* style hidden sizing text and input to match in size */
.nd-todo__description,
.nd-todo__description-force-size {
  margin-top: 2px;
  font-size: 1rem;
  font-family: var(--font-family);
}

.nd-todo__description {
  background: transparent;
  border: none;
  color: var(--color-text);
  resize: none;
  display: block;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.nd-todo__description-force-size {
  visibility: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  padding-bottom: 4px;
}
.nd-todo__description::placeholder {
  color: var(--color-text-subtle);
}
.nd-todo input:focus,
.nd-todo__description:focus {
  outline: none;
}
.nd-todo--checked,
.nd-todo--checked .nd-todo__description {
  text-decoration: line-through;
  color: var(--color-text-subtle);
}
/* accessibly, hiding the actual checkbox */
.nd-todo input[type='checkbox'] {
  opacity: 0;
  width: 1px;
  height: 1px;
  position: absolute;
  pointer-events: none;
}
/* styling a div to look like a checkbox */
.nd-todo__checkbox {
  display: block;
  height: 22px;
  width: 21px;
  border: 2px solid var(--color-text-subtle);
  border-radius: 8px;
  margin-right: 8px;
}
.nd-todo__checkbox--checked:after {
  content: ' ';
  display: block;
  transform: rotate(45deg);
  margin: -4px 8px;
  height: 17px;
  width: 6px;
  border-bottom: 4px solid var(--color-text);
  border-right: 4px solid var(--color-text);
  box-shadow: 2px 0 0 var(--color-surface);
  box-shadow: 2px 0 0 0 var(--color-surface),
    inset -2px 0 0 0 var(--color-surface);
}
</style>
