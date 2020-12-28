import { computed, Ref, ref } from 'vue'
import { daysBetween } from '../helpers/dates';
import { useStorageValue } from '../helpers/storage';

interface Todo {
    title: string,
    created: Date;
    completed: false|Date;
}

export const todos = useStorageValue<Todo[]>('todos', [])

export function emptyTodo () : Todo {
    return { title: "", created: new Date(), completed: false };
}

/** Add a To Do item */
export function addTodo (todo: Todo) {
    todos.value.push(todo);
}

/** Move todo to archive immeadiately. Do not mark as complete */
export function deleteTodo (index: number) {
    archiveTodo(index);
}

/** Mark todo as complete. Will stay in list until it matches archive conditions and archive is triggered. */
export function completeTodo (index: number) {
    todos.value[index].completed = new Date();
}

/** 
 * Currently this just deletes a todo.
 * Ideally it would write it to disk storage for later retrevial
 */
export function archiveTodo (index: number) {
    delete todos.value[index];
}

/** 
 * Archive todos (move completed todos off visible list) based on a rule.
 * To be triggered when window is reopened (E.g. on mounted).
 * 
 * Current rule: completed yesterday and it's after 6am
 */
export function archiveTodos () {
    const now = new Date();
    const pastStartOfDay = now.getHours() >= 6; // start of day is 6am
    if (pastStartOfDay) {
        // const yesterday = new Date(now.getDate() - 1);
        todos.value.forEach((todo, index) => {
            if (todo.completed && daysBetween(todo.completed, now) > 0) {
                archiveTodo(index)
            }
        });
    }

    
}

/** As archive will grow, we don't keep it in memory unles we are displaying it */
export function getArchive () {
    // TODO: Currently archived todos are just trashed
}

