<template>
  <div class="admin-dashboard-view p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ t('admin.dashboard.title') }}</h1>
    <p class="text-gray-600 mb-8">{{ t('admin.dashboard.welcome') }}</p>
    <nav class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <router-link 
        to="/admin/submissions" 
        class="btn-primary text-lg py-3 px-6 text-center rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out">
        {{ t('admin.dashboard.viewSubmissions') }}
      </router-link>
      <router-link 
        to="/admin/statistics" 
        class="btn-primary text-lg py-3 px-6 text-center rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out">
        {{ t('admin.dashboard.viewStatistics') }}
      </router-link>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
