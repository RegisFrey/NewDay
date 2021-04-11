import { createApp } from 'vue';
import App from './App.vue';
import { authOnNewTab } from './state/auth';

export function bootstrap (alwaysShowOptions?: boolean): void {
    createApp(App, { alwaysShowOptions }).mount('#app');
    authOnNewTab();
}