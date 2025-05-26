<template>
  <div class="callback-view">
    <p>{{ t('callback.loading') }}</p>
    <!-- Optional: Add a visual loader/spinner here -->
    <div class="loader" v-if="isLoading"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter, useRoute } from 'vue-router'; // Import useRoute
import { useI18n } from 'vue-i18n';

const { handleRedirectCallback, isLoading } = useAuth0();
const router = useRouter();
const route = useRoute(); // Get current route instance
const { t } = useI18n();

onMounted(async () => {
  try {
    console.log('AuthCallback.vue: Mounted. Calling handleRedirectCallback...');
    await handleRedirectCallback();
    console.log('AuthCallback.vue: handleRedirectCallback completed.');
    
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath); 
    console.log(`AuthCallback.vue: Redirecting to ${redirectPath}`);
  } catch (e) {
    console.error('AuthCallback.vue: Error handling redirect callback:', e);
    router.push('/login?error=callback_failed'); 
  }
});
</script>

<style scoped>
.callback-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 50vh;
  text-align: center;
}

.callback-view p {
  font-size: 1.2rem;
  color: #495057; /* nathan-secondary */
  margin-bottom: 1rem;
}

.loader { /* Copied from App.vue for consistency */
  border: 4px solid #f3f3f3;
  border-top: 4px solid #005A70; /* nathan-primary */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
