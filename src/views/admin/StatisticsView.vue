<template>
  <div class="statistics-view p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ t('admin.statistics.title') }}</h1>

    <div v-if="isLoading" class="loading-state text-center py-10">
      <div class="loader inline-block"></div>
      <p class="text-gray-500 mt-2">{{ t('admin.loadingData') }}</p>
    </div>

    <div v-if="error" class="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">{{ t('admin.errors.fetchStatsFailed') }}</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="stats && !isLoading && !error" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="stat-card bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ t('admin.statistics.totalSubmissions') }}</h2>
        <p class="text-3xl font-bold text-gray-900">{{ stats.totalSubmissions }}</p>
      </div>
      <div class="stat-card bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ t('admin.statistics.averageScore') }}</h2>
        <p class="text-3xl font-bold text-gray-900">{{ stats.averageTotalScore }}</p>
      </div>
      <div class="stat-card bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ t('admin.statistics.q10CriticalCount') }}</h2>
        <p class="text-3xl font-bold text-gray-900">{{ stats.q10CriticalCount }}</p>
      </div>
      
      <div class="stat-card bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h2 class="text-xl font-semibold text-gray-700 mb-3">{{ t('admin.statistics.scoreDistribution.title') }}</h2>
        <ul class="space-y-1 text-gray-700">
          <li>{{ t('admin.statistics.scoreDistribution.low') }}: <span class="font-semibold">{{ stats.scoreDistribution?.low }}</span></li>
          <li>{{ t('admin.statistics.scoreDistribution.medium') }}: <span class="font-semibold">{{ stats.scoreDistribution?.medium }}</span></li>
          <li>{{ t('admin.statistics.scoreDistribution.high') }}: <span class="font-semibold">{{ stats.scoreDistribution?.high }}</span></li>
        </ul>
      </div>

      <div class="stat-card bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h2 class="text-xl font-semibold text-gray-700 mb-3">{{ t('admin.statistics.submissionsByLanguage.title') }}</h2>
        <ul class="space-y-1 text-gray-700" v-if="stats.submissionsByLanguage && Object.keys(stats.submissionsByLanguage).length">
          <li v-for="(count, lang) in stats.submissionsByLanguage" :key="lang">
            {{ lang.toUpperCase() }}: <span class="font-semibold">{{ count }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-500 italic">N/A</p>
      </div>
    </div>
    
    <router-link 
      to="/admin" 
      class="inline-block mt-8 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150">
      &larr; {{ t('admin.backToDashboard') }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { adminService } from '../../services/adminService'; // Adjust path if needed

const { t } = useI18n();
const stats = ref<any | null>(null); // Define a proper type later
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;
    stats.value = await adminService.getStatistics();
  } catch (err: any) {
    error.value = err.message || t('admin.errors.fetchStatsFailed');
    console.error("Error fetching statistics:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.loading-state {
  /* Custom styling for loading state if needed beyond centering text */
}
.loader { /* Re-use from App.vue or define here if scoped */
  border: 4px solid #f3f3f3;
  border-top: 4px solid #005A70; /* nathan-primary */
  border-radius: 50%;
  width: 32px; /* Slightly smaller for inline use */
  height: 32px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.stat-card p {
  /* Ensure readability for paragraph text within cards if needed */
}
</style>
