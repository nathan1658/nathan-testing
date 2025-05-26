<template>
  <div class="submissions-view p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ t('admin.submissions.title') }}</h1>
    
    <div v-if="isLoading" class="loading-state text-center py-10">
      <div class="loader inline-block"></div> <!-- Re-use loader style from App.vue or define locally -->
      <p class="text-gray-500 mt-2">{{ t('admin.loadingData') }}</p>
    </div>
    
    <div v-if="error" class="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">{{ t('admin.errors.fetchSubmissionsFailed') }}</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    
    <div v-if="!isLoading && !error && submissions.length === 0" class="text-center py-10">
      <p class="text-xl text-gray-500">{{ t('admin.submissions.noSubmissions') }}</p>
    </div>

    <div v-if="!isLoading && !error && submissions.length > 0" class="overflow-x-auto shadow-md rounded-lg">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3">{{ t('admin.submissions.table.date') }}</th>
            <th scope="col" class="px-6 py-3">{{ t('admin.submissions.table.userId') }}</th>
            <th scope="col" class="px-6 py-3">{{ t('admin.submissions.table.age') }}</th>
            <th scope="col" class="px-6 py-3">{{ t('admin.submissions.table.totalScore') }}</th>
            <th scope="col" class="px-6 py-3">{{ t('admin.submissions.table.q10Score') }}</th>
            <th scope="col" class="px-6 py-3">{{ t('admin.submissions.table.language') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in submissions" :key="submission._id" class="bg-white border-b hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4">{{ formatDate(submission.submissionTimestamp) }}</td>
            <td class="px-6 py-4" :title="submission.userId">{{ truncateUserId(submission.userId) }}</td>
            <td class="px-6 py-4">{{ submission.age }}</td>
            <td class="px-6 py-4">{{ submission.totalScore }}</td>
            <td class="px-6 py-4">{{ submission.q10Score }}</td>
            <td class="px-6 py-4">{{ submission.language.toUpperCase() }}</td>
          </tr>
        </tbody>
      </table>
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
import { adminService } from '../../services/adminService';
import { formatDate, truncateUserId } from '../../utils/displayFormatters'; // Import from utils

const { t } = useI18n();
const submissions = ref<any[]>([]); // Define a proper type later
const isLoading = ref(true);
const error = ref<string | null>(null);

// formatDate and truncateUserId are now imported, so no need to define them here.

onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;
    submissions.value = await adminService.getSubmissions();
  } catch (err: any) {
    error.value = err.message || t('admin.errors.fetchSubmissionsFailed');
    console.error("Error fetching submissions:", err);
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
</style>
