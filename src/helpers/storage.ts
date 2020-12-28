import { ref, watch, Ref } from "vue"
import 'chrome-extension-async'
import { jsonDateReviver } from "./dates";

const IS_RUNNING_AS_EXTENSION = false;

export async function useStorageValue <T> (key: string, defaultValue: T): Promise<Ref<T>> {

    const valueFromStorage = IS_RUNNING_AS_EXTENSION ?
        localStorage.getItem(key) :
        (await chrome.storage.sync.get(['key']) as { key: string, value: string }).value;
    const valueParsed = valueFromStorage ? JSON.parse(valueFromStorage, jsonDateReviver) as T : defaultValue;
    const valueRef = ref(valueParsed) as Ref<T>
    
    /* Update storage on changes */
    watch(valueRef,
        (newValue) => {
            localStorage.setItem(key, JSON.stringify(newValue))
        },
        { deep: true }
    )

    return valueRef
}