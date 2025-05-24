<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h2 class="text-2xl font-bold nathan-primary mb-4">{{ t('resultsModal.title') }}</h2>
      <div class="text-4xl font-bold text-center my-6">{{ totalScore }} / 30</div>
      <div class="mb-6" v-html="scoreInterpretationHTML"></div>
      
      <div v-if="item10SpecificWarning" class="critical-emergency my-4">
          <p><strong>{{ t('resultsModal.item10WarningTitle') }}</strong> {{ t('resultsModal.item10WarningText') }}</p>
      </div>

      <div v-if="showGeminiFeature" id="geminiFeatureSection">
        <hr class="my-6">
        <button @click="$emit('getGentleTips')" :disabled="geminiLoading" class="btn-primary w-full mb-2">
            ✨ {{ t('buttons.getGentleTips') }}
        </button>
        <div v-if="geminiLoading" class="loader"></div>
        <div v-if="geminiResultText" class="gemini-content">
          <h4>{{ t('gemini.title') }}</h4>
          <p>{{ geminiResultText }}</p> 
          <p class="text-xs mt-3">
            <strong>{{ t('gemini.disclaimerTitle') }}</strong> {{ t('gemini.disclaimerText') }}
          </p>
        </div>
          <p v-if="geminiError" class="text-red-500 text-sm mt-2">{{ geminiError }}</p>
      </div>
      
      <div id="bookingSection">
        <hr class="my-6">
        <h3 class="text-lg font-semibold mb-3">{{ t('booking.title') }}</h3>
        <div class="mb-4">
          <label for="bookingLocation" class="form-label">{{ t('booking.selectLocation') }}:</label>
          <select 
            id="bookingLocation" 
            :value="bookingLocation" 
            @change="$emit('update:bookingLocation', ($event.target as HTMLSelectElement).value)" 
            class="form-select">
            <option value="">{{ t('booking.noThanks') }}</option>
            <option value="CN">{{ t('booking.locations.cn') }}</option>
            <option value="HV">{{ t('booking.locations.hv') }}</option>
            <option value="TH">{{ t('booking.locations.th') }}</option>
            <option value="Dr. Pan">{{ t('booking.locations.drPan') }}</option>
            <option value="Dr. Liao">{{ t('booking.locations.drLiao') }}</option>
          </select>
        </div>
        <button @click="$emit('confirmBooking')" class="btn-primary w-full mb-2">{{ t('buttons.confirmFinish') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  show: boolean;
  totalScore: number;
  scoreInterpretationHTML: string;
  item10SpecificWarning: boolean;
  showGeminiFeature: boolean;
  geminiLoading: boolean;
  geminiResultText: string;
  geminiError: string;
  bookingLocation: string;
  // t prop removed
}>();

defineEmits<{
  (e: 'getGentleTips'): void;
  (e: 'confirmBooking'): void;
  (e: 'update:bookingLocation', value: string): void;
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

.loader {
  border: 4px solid #f3f3f3; 
  border-top: 4px solid #005A70; 
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

.gemini-content {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #eef2f5; 
  border-radius: 0.375rem;
  border: 1px solid #d1dce5;
}

.gemini-content h4 {
  font-weight: 600;
  color: #005A70; 
  margin-bottom: 0.5rem;
}

.gemini-content p {
  white-space: pre-wrap;
}
</style>
