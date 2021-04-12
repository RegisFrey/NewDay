import { ref, watch, Ref } from 'vue';
import { jsonDateReviver } from './dates';
import { browser } from 'webextension-polyfill-ts';
import { debounce } from './debounce';

export async function useStorageValue<T>(
  key: string,
  defaultValue: T,
  existingRef: Ref<T>|undefined = undefined,
  debounceTimeout = 500
): Promise<Ref<T>> {

  // TODO: Stop stringifying values (pass over as json instead, don't JSON.parse on return)

  const valueFromStorage = await browser.storage.sync.get(key);
  const foundValue = valueFromStorage && key in valueFromStorage;
  const valueParsed = foundValue
    ? (JSON.parse(valueFromStorage[key], jsonDateReviver) as T)
    : defaultValue;

  // initialize ref and set value of existingRef if already existed
  const valueRef = existingRef ?
    existingRef :
    ref(valueParsed) as Ref<T>;
  if (existingRef) {
    existingRef.value = valueParsed;
  }

  // handle "This request exceeds the MAX_WRITE_OPERATIONS_PER_MINUTE quota." errors
  // by queuing against localStorage state?
  // dumping/syncing on losing focus.

  /* Update storage on changes in Vue, debounced */
  const debouncedStorageSync = debounce((newValue: T) => {
    browser.storage.sync.set({ [key]: JSON.stringify(newValue) });
  }, debounceTimeout);

  watch(
    valueRef,
    (newValue: T) => {
      debouncedStorageSync(newValue);
    },
    { deep: true },
  );

  /* Update Vue on changes in storage (e.g. from other tabs) */
  browser.storage.onChanged.addListener((changes) => {
    /** Check if outstanding local changes and prefer those over partial updates from other tabs */
    if (key in changes) {
      valueRef.value = JSON.parse(changes[key].newValue, jsonDateReviver) as T;
    }
  });

  return valueRef;
}
