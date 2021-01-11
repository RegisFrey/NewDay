import { Ref, ref } from 'vue';
import { useStorageValue } from '../helpers/storage';

let notesHtml: Ref<string> = ref('');

export async function loadNotes () {
  notesHtml = await useStorageValue<string>('notes', '');
  return notesHtml;
}