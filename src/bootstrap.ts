import { createApp } from 'vue';
import App from './App.vue';

export function bootstrap (alwaysShowOptions?: boolean): void {
    createApp(App, { alwaysShowOptions }).mount('#app');
}