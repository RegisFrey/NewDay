import { ref, watch, Ref } from 'vue';
import { jsonDateReviver } from './dates';
import { browser } from "webextension-polyfill-ts";

export async function useStorageValue<T>(key: string, defaultValue: T): Promise<Ref<T>> {
  const valueFromStorage = await browser.storage.local.get(key);
  const foundValue = (valueFromStorage && key in valueFromStorage);
  const valueParsed = foundValue
    ? (JSON.parse(valueFromStorage[key], jsonDateReviver) as T)
    : defaultValue;
  const valueRef = ref(valueParsed) as Ref<T>;

  /* Update storage on changes in Vue */
  watch(
    valueRef,
    (newValue: T) => {
      browser.storage.local.set({ [key]: JSON.stringify(newValue) });
    },
    { deep: true },
  );

  return valueRef;
}
