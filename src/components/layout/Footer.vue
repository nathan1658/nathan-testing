<template>
  <footer class="text-center mt-12 py-6 border-t border-gray-300">
    <p class="text-sm text-gray-500">
      {{ t('footer.references') }}
    </p>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
/* No footer-specific styles identified beyond Tailwind and global classes */
</style>
