import { computed, Ref } from 'vue';
import { useStorageValue } from '../helpers/storage';
import { usePreferredColorScheme } from '@vueuse/core'

export enum ThemePreference {
    Light = "Light",
    Dark = "Dark",
    BySystemSetting = "BySystemSetting",
}

let themePreference: Ref<ThemePreference>|null = null;

export async function getThemePreference(): Promise<Ref<ThemePreference>> {
    if (themePreference === null) {
        themePreference = await useStorageValue<ThemePreference>('theme', ThemePreference.BySystemSetting);
    }
    return themePreference;
}

export async function getResolvedTheme(): Promise<Ref<ThemePreference>> {
    const _themePreference: Ref<ThemePreference> = await getThemePreference();
    return computed(() => {
        if (_themePreference.value === ThemePreference.BySystemSetting) {
            const preferredColor = usePreferredColorScheme()
            if (preferredColor.value === "dark") {
                return ThemePreference.Dark;
            } else {
                return ThemePreference.Light;
            }
        } else {
            return _themePreference.value;
        }
    })
    
}