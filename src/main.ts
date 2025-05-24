import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n' // Import the i18n instance

// Global styles are primarily handled in App.vue's <style> tag.

createApp(App)
  .use(router)
  .use(i18n) // Use the i18n instance
  .mount('#app')
