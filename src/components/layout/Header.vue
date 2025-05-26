<template>
  <header class="text-center mb-8 relative py-4">
    <div class="header-controls absolute top-4 right-4 flex items-center">
      <!-- Language Switcher -->
      <div class="language-switcher mr-4">
        <button 
          @click="changeLanguage('en')" 
          class="btn-lang text-sm px-3 py-1 mr-1" 
          :class="{ 'active': locale === 'en' }">
          English
        </button>
        <button 
          @click="changeLanguage('zh')" 
          class="btn-lang text-sm px-3 py-1" 
          :class="{ 'active': locale === 'zh' }">
          中文
        </button>
      </div>

      <!-- Auth Actions -->
      <div class="auth-actions">
        <div v-if="authStore.isLoading">
          <span class="text-sm text-gray-600">{{ t('auth.loading') }}</span>
        </div>
        <div v-else>
          <button v-if="!authStore.isAuthenticated" @click="handleLogin" class="btn-secondary text-sm px-3 py-1">
            {{ t('auth.login') }}
          </button>
          <div v-if="authStore.isAuthenticated" class="user-info flex items-center">
            <span v-if="authStore.user" class="mr-2 text-sm text-gray-700">{{ t('auth.welcome', { name: authStore.user.name || authStore.user.email }) }}</span>
            <button @click="handleLogout" class="btn-secondary text-sm px-3 py-1">
              {{ t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <h1 class="text-3xl md:text-4xl font-bold nathan-primary">{{ t('appTitleShort') }}</h1>
    <h2 class="text-2xl md:text-3xl font-semibold nathan-primary mt-2">{{ t('epdsTitle') }}</h2>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../store/authStore'; // Import Auth store

const { t, locale } = useI18n();
const authStore = useAuthStore();

const emit = defineEmits<{
  (e: 'setLanguage', lang: 'en' | 'zh'): void;
}>();

const changeLanguage = (lang: 'en' | 'zh') => {
  locale.value = lang; 
  emit('setLanguage', lang); 
};

const handleLogin = () => {
  authStore.login(); // Directly call the store's login action
};

const handleLogout = () => {
  authStore.logout({ logoutParams: { returnTo: window.location.origin + '/login' } });
  // Ensure Auth0 dashboard has 'http://localhost:5173/login' (or production equivalent) 
  // in "Allowed Logout URLs" for the application.
};
</script>

<style scoped>
.header-controls {
  /* Adjust positioning if needed */
}

.language-switcher {
  /* Styles for language switcher if needed */
}

.auth-actions {
  /* Styles for auth actions container if needed */
}

.user-info {
  /* Styles for user info display if needed */
}

/* btn-lang, btn-secondary, nathan-primary are assumed global from App.vue or similar.
   Tailwind classes are used for most styling.
*/
</style>
