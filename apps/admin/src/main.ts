import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// Styles globaux
import './style.css';
import './assets/styles/main.css';

// Initialisation Vue
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');