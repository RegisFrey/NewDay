<template>
  <div class="nd-todos">
    <Todo
      v-for="(todo, index) in todos"
      :key="'todo-' + index"
      :completed="todo.completed !== false"
      @update:completed="todo.completed = $event"
      v-model:title="todo.title"
      :ref="
        (el) => {
          if (el) todoElements[index] = el;
        }
      "
    />

    <Todo
      :completed="newTodoCompleted"
      @update:completed="dontCompletePlaceholderTodo"
      :title="newTodoEmptyTitle"
      @update:title="newTodo"
      :key="'todo-new-' + newTodoForceUpdate"
    />
    <!-- TODO: Reorder items? -->
    <!-- TODO: Delete items? -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUpdate, Ref, nextTick } from 'vue';
import { todos, loadTodos, addTodo, archiveTodos } from '../state/todos';
import Todo from './Todo.vue';

export default defineComponent({
  name: 'Todos',
  components: { Todo },
  async setup() {
    const newTodoCompleted = ref(false);
    const newTodoEmptyTitle = ref('');
    const newTodoForceUpdate = ref(0);
    const todoElements: Ref<Array<typeof Todo>> = ref([]);

    onBeforeUpdate(() => {
      todoElements.value = [];
    });

    function newTodo(title: string) {
      // add todo with current event value
      addTodo({
        title,
        created: new Date(),
        completed: false,
      });
      // set new todo values back to defaults
      newTodoCompleted.value = false;
      newTodoEmptyTitle.value = '';
      newTodoForceUpdate.value = Math.random();
      // focus on just added todo text input in ui
      nextTick(() => {
        const lastTodoIndex = todos.value.length - 1;
        const lastTodoElement = todoElements.value[lastTodoIndex];
        lastTodoElement.focusInput();
      });
    }

    function dontCompletePlaceholderTodo() {
      newTodoCompleted.value = false;
      newTodoForceUpdate.value = Math.random();
      // could use $forceUpdate instead?
    }

    await loadTodos();
    archiveTodos();

    return {
      // todos
      todos,
      todoElements,
      newTodo,
      dontCompletePlaceholderTodo,
      newTodoCompleted,
      newTodoEmptyTitle,
      newTodoForceUpdate,
    };
  },
});
</script>

<style>
.nd-todos {
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
