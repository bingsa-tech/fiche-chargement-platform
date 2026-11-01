import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
// Importation des fichiers CSS globaux
import './assets/styles/main.css';
import './style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');