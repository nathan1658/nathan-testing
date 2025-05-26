<template>
  <div class="login-view">
    <h2>{{ t('login.title') }}</h2>
    <button @click="handleLogin" class="btn-primary">{{ t('login.button') }}</button>
    <div v-if="authError" class="error-message">{{ authError.message }}</div>
    <div v-if="isLoading" class="loading-message">{{ t('login.loading') }}</div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { useI18n } from 'vue-i18n';

const { loginWithRedirect, error: authError, isLoading } = useAuth0();
const { t } = useI18n();

const handleLogin = () => {
  loginWithRedirect();
};
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 50vh; /* Adjust as needed */
}

.login-view h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #005A70; /* nathan-primary */
}

.error-message {
  color: red;
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid red;
  border-radius: 0.25rem;
  background-color: #ffebee;
}

.loading-message {
  margin-top: 1rem;
  color: #495057; /* nathan-secondary */
}

/* btn-primary is assumed to be globally available from App.vue styles */
</style>
