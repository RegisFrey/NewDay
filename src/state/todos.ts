import { Ref, ref } from 'vue';
import { daysBetween } from '../helpers/dates';
import { useStorageValue } from '../helpers/storage';

interface Todo {
  title: string;
  created: Date;
  completed: false | Date;
}

export let todos: Ref<Todo[]> = ref([]);

export async function loadTodos(): Promise<void> {
  todos = await useStorageValue<Todo[]>('todos', []);
}

export function emptyTodo(): Todo {
  return { title: '', created: new Date(), completed: false };
}

export function addTodo(todo: Todo): void {
  todos.value.push(todo);
}

/** Move todo to archive immeadiately. Do not mark as complete */
export function deleteTodo(index: number): void {
  archiveTodo(todos.value[index]);
  todos.value.splice(index, 1);
}

/** Mark todo as complete. Will stay in list until it matches archive conditions and archive is triggered. */
export function completeTodo(index: number): void {
  todos.value[index].completed = new Date();
}

/**
 * Currently this is a no-op.
 * Ideally it would write it to disk storage for later retrevial
 */
export function archiveTodo(_todo: Todo): void {}

/**
 * Archive todos (move completed todos off visible list) based on a rule.
 * To be triggered when window is reopened (E.g. on mounted).
 *
 * Current rule: completed yesterday and it's after 6am
 */
export function archiveTodos(): void {
  const now = new Date();
  const pastStartOfDay = now.getHours() >= 6; // we consider start of day as 6am
  if (pastStartOfDay) {
    todos.value = todos.value.filter((todo, _index) => {
      if (todo && todo.completed && daysBetween(todo.completed, now) > 0) {
        archiveTodo(todo);
        return false;
      }
      return true;
    });
  }
}

/** As archive will grow, we don't keep it in memory unles we are displaying it */
export function getArchive(): void {
  // TODO: Currently "archived" todos are just trashed without actually archiving
}
