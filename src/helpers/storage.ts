import { ref, watch, Ref } from "vue"
import { jsonDateReviver } from "./dates";

export async function useStorageValue <T> (key: string, defaultValue: T): Promise<Ref<T>> {

    const valueFromStorage = localStorage.getItem(key);
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