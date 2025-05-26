import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { createAuth0 } from '@auth0/auth0-vue';
import { createPinia } from 'pinia'; // Import createPinia

const app = createApp(App);
const pinia = createPinia(); // Create Pinia instance

app.use(pinia); // Use Pinia
app.use(router);
app.use(i18n);
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN as string,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
    authorizationParams: {
      redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL as string,
      // audience: 'YOUR_API_IDENTIFIER' // Add if you have an API
    }
  })
);

app.mount('#app');
