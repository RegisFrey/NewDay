import { ref, watch, Ref } from 'vue';
import { jsonDateReviver } from './dates';

export function useStorageValue<T>(key: string, defaultValue: T): Ref<T> {
  const valueFromStorage = localStorage.getItem(key);
  const valueParsed = valueFromStorage
    ? (JSON.parse(valueFromStorage, jsonDateReviver) as T)
    : defaultValue;
  const valueRef = ref(valueParsed) as Ref<T>;

  /* Update storage on changes */
  watch(
    valueRef,
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true },
  );

  return valueRef;
}
