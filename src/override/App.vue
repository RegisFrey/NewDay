<template>
<div class="splash-pad">
  <header class="splash-pad__header">
    <div class="splash-pad__today">
      <h1>
        <span class="splash-pad__hour">{{ time }}</span>
        <span class="splash-pad__day">{{ day }}</span>
        <span class="splash-pad__date">{{ date }}</span>
        <!-- December 26th -->
      </h1>
    </div>
  </header>

  <div class="splash-pad__content">
    <div class="splash-pad__calendar">
      <h2>Today</h2>
      <!--
      TODO: GCal integration
      <a href="#">Login with Google for Calendar</a>
      -->
      <div class="splash-pad__calendar__entry splash-pad__calendar__entry--now">
      <b class="splash-pad__meeting__time">2:10 PM</b>
      Meeting Name Something
      </div>

      <div class="splash-pad__calendar__entry">
      <b class="splash-pad__meeting__time">3:20 PM</b>
      Meeting Name Something
      </div>

      <div class="splash-pad__calendar__entry">
      <b class="splash-pad__meeting__time">5:00 PM</b>
      Other Event
      </div>


    </div>

    <div class="splash-pad__todos">
      <h2>Todo</h2>

      <Todo
        v-for="(todo, index) in todos"
        :key="'todo-' + index"
        :completed="(todo.completed !== false)"
        @update:completed="todo.completed = $event"
        v-model:title="todo.title"
        :ref="el => { if (el) todoElements[index] = el }"
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
      <!-- TODO: Persistence -->
    </div>

    <div class="splash-pad__notes">
      <h2>Notes</h2>
      <textarea placeholder="Type notes">

      </textarea>
      <!-- TODO: Markdown or TipTap editor -->
      <!-- TODO: Persistence -->
    </div>
  </div>
</div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { defineComponent, computed, ref, onBeforeUpdate, Ref, nextTick } from 'vue';
import { todos, loadTodos, addTodo, archiveTodos } from '../state/todos';
import Todo from '../components/Todo.vue';

export default defineComponent({
  name: 'App',
  components: { Todo },
  async setup () {
    // TIME
    const now = ref(new Date());

    const day = computed(() => new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(now.value));
    const time = computed(() => new Intl.DateTimeFormat('en-US', { hour: "numeric", minute: "numeric" }).format(now.value));
    // @ts-ignore: https://github.com/microsoft/TypeScript/issues/38266
    const date = computed(() => new Intl.DateTimeFormat('en-US', { dateStyle: "long" }).format(now.value));

    /* Setup update loop on the minute */
    const secondsRemainingInMinute = (60 - now.value.getSeconds()) * 1000;

    function updateTime () {
      now.value = new Date();
    }

    setTimeout(() => {
        updateTime();
        setInterval(() => {
          updateTime();
        }, 60000);
    }, secondsRemainingInMinute);
    
    // TODOS
    const newTodoCompleted = ref(false);
    const newTodoEmptyTitle = ref("");
    const newTodoForceUpdate = ref(0);
    const todoElements: Ref<Array<typeof Todo>> = ref([])
    
    onBeforeUpdate(() => {
        todoElements.value = []
    })

    function newTodo (title: string) {
      // add todo with current event value
      addTodo({
        title,
        created: new Date(),
        completed: false,
      })
      // set new todo values back to defaults
      newTodoCompleted.value = false
      newTodoEmptyTitle.value = ""
      newTodoForceUpdate.value = Math.random() 
      // focus on just added todo text input in ui
      nextTick(() => {
        const lastTodoIndex = todos.value.length - 1;
        const lastTodoElement = todoElements.value[lastTodoIndex];
        lastTodoElement.focusInput()
      })
    }

    function dontCompletePlaceholderTodo () {
      newTodoCompleted.value = false
      newTodoForceUpdate.value = Math.random() 
      // could use $forceUpdate instead?
    }

    await loadTodos()
    archiveTodos()

    return {
      // todos
      todos, todoElements,
      newTodo, dontCompletePlaceholderTodo,
      newTodoCompleted, newTodoEmptyTitle, newTodoForceUpdate,
      // time and date
      now, day, time, date, 
    }
  },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,800;1,400&display=swap');

html, body, #app, .splash-pad {
  width: 100vw;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

#app {
  --color-surface: #1E1E1E;
  --color-text: #C7C7C7;
  --color-text-subtle: #767676;
  --color-link: #0C7D9D;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-family: 'Open Sans', sans-serif;
}

.splash-pad {
  display: flex;
  flex-direction: column;
}

.splash-pad__header {

}

.splash-pad__content {
  display: flex;
  flex-direction: row;
  flex: 1;
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
}

.splash-pad__meeting__time {
  font-size: 1.5rem;
}

.splash-pad__todos {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 3;
}

.splash-pad__notes {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 7;
}

.splash-pad__notes > textarea {
  display: flex;
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none; /** TODO: Focus style */
  color: var(--color-text);
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

h2 {
  text-transform: uppercase;
  font-size: 1rem;
  line-height: 1rem;
  color: var(--color-text-subtle);
}

 a {
  color: var(--color-link)
 }

.splash-pad__calendar__entry {
  display: flex;
   flex-direction: column;
   border-bottom: 1px solid rgb(55, 55, 55);
   padding-bottom: 8px;
   margin-bottom: 16px;
}

.splash-pad__calendar__entry--now {
  color: rgb(249, 97, 80); 
}
</style>
