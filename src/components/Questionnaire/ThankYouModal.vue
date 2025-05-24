<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h2 class="text-2xl font-bold nathan-primary mb-4">{{ t('thankYouModal.title') }}</h2>
      <div class="mb-6" v-html="thankYouMessageHTML"></div>
      <div class="mt-4 p-4 nathan-light-bg rounded-md">
        <h4 class="font-semibold mb-2">{{ t('contactInfo.title') }}:</h4>
        <p><strong>{{ t('contactInfo.cn.name') }}:</strong> {{ t('contactInfo.cn.details') }}</p>
        <p><strong>{{ t('contactInfo.hv.name') }}:</strong> {{ t('contactInfo.hv.details') }}</p>
        <p><strong>{{ t('contactInfo.th.name') }}:</strong> {{ t('contactInfo.th.details') }}</p>
        <p class="mt-2"><em>{{ t('contactInfo.note') }}</em></p>
      </div>
        <div class="critical-emergency mt-6">
        <p><strong>{{ t('urgentWarning.titleReminder') }}</strong> {{ t('urgentWarning.text') }}</p>
      </div>
      <button @click="$emit('closeModal')" class="btn-primary w-full mt-6">{{ t('buttons.close') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  show: boolean;
  thankYouMessageHTML: string;
  // t prop removed
}>();

defineEmits<{
  (e: 'closeModal'): void;
}>();
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px; 
  max-height: 90vh;
  overflow-y: auto;
}
</style>
