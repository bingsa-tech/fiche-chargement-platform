import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// =====================================================
// STYLES GLOBAUX
// =====================================================

// Feuille de style principale
import './style.css';

// Styles de l'application
import './assets/styles/tokens.css';
import './assets/styles/reset.css';
import './assets/styles/typography.css';
import './assets/styles/layout.css';
import './assets/styles/components.css';
import './assets/styles/utilities.css';
import './assets/styles/main.css';

// =====================================================
// INITIALISATION VUE
// =====================================================

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
