<template>
  <header class="text-center mb-8 relative">
    <div class="absolute top-0 right-0 mt-2 mr-2 md:mt-0 md:mr-0">
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
    <h1 class="text-3xl md:text-4xl font-bold nathan-primary">{{ t('appTitleShort') }}</h1>
    <h2 class="text-2xl md:text-3xl font-semibold nathan-primary mt-2">{{ t('epdsTitle') }}</h2>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// Define emits to notify parent about language change
const emit = defineEmits<{
  (e: 'setLanguage', lang: 'en' | 'zh'): void;
}>();

const changeLanguage = (lang: 'en' | 'zh') => {
  // Update locale for this component (and globally via useI18n instance)
  locale.value = lang; 
  // Emit event for parent to handle localStorage or other global state if needed
  emit('setLanguage', lang); 
};
</script>

<style scoped>
/* btn-lang and nathan-primary are defined globally in App.vue for now */
/* No header-specific styles identified beyond Tailwind and global classes */
</style>
