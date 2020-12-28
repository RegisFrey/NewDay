<template>
<transition name="splash-pad__todo">
<label
  class="splash-pad__todo"
  :class="{'splash-pad__todo--checked': completed}"
  >
  <span
    class="splash-pad__todo__checkbox"
    :class="{ 'splash-pad__todo__checkbox--checked': completed }"
    />
  <input
    type="checkbox"
    :checked="completed"
    @change="changeChecked"
    />
  <input
    :value="title"
    @input="changeTitle" placeholder="..."
    ref="todoInput"
    />
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
        changeChecked (event) {
          console.log('changeChecked', event.target.checked);
          this.$emit('update:completed', event.target.checked ? new Date() : false)
        },
        changeTitle (event) {
          console.log('changeTitle', event.target.value);
          this.$emit('update:title', event.target.value)
        },
        focusInput () {
          this.$refs.todoInput.focus();
        }
    }
});
</script>

<style>
.splash-pad__todo {
  display: flex;
  margin-bottom: 8px;
}
.splash-pad__todo input {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  display: block;
  flex: 1;
}
.splash-pad__todo input:focus {
  outline: none;
}
.splash-pad__todo--checked,
.splash-pad__todo--checked input {
  text-decoration: line-through;
  color: var(--color-text-subtle);
}
.splash-pad__todo input[type="checkbox"] {
  opacity: 0;
  width: 1px;
  height: 1px;
  position: absolute;
  pointer-events: none;
}
.splash-pad__todo__checkbox {
  display: block;
  height: 22px;
  width: 21px;
  border: 2px solid var(--color-text-subtle);
  border-radius: 8px;
  margin-right: 8px;
}
.splash-pad__todo__checkbox--checked:after {
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