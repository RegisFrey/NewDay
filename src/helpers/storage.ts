import { ref, watch, Ref } from 'vue';
import { jsonDateReviver } from './dates';
import { browser } from "webextension-polyfill-ts";

export async function useStorageValue<T>(key: string, defaultValue: T): Promise<Ref<T>> {
  const valueFromStorage = await browser.storage.sync.get(key);
  const foundValue = (valueFromStorage && key in valueFromStorage);
  const valueParsed = foundValue
    ? (JSON.parse(valueFromStorage[key], jsonDateReviver) as T)
    : defaultValue;
  const valueRef = ref(valueParsed) as Ref<T>;

  /* Update storage on changes in Vue */
  watch(
    valueRef,
    (newValue: T) => {
      browser.storage.sync.set({ [key]: JSON.stringify(newValue) });
    },
    { deep: true },
  );

  /* Update Vue on changes in storage (e.g. from other tabs) */
  browser.storage.onChanged.addListener((changes) => {
    if (key in changes) {
      valueRef.value = (JSON.parse(changes[key].newValue, jsonDateReviver) as T)
    }
  });

  return valueRef;
}
