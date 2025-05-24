<template>
  <div class="question-card">
    <p class="font-semibold mb-3 text-lg">
      {{ index }}. {{ t(question.textKey) }}
    </p>
    <div class="space-y-2">
      <label 
        v-for="option in question.options" 
        :key="option.value"
        class="radio-label"
        :class="{ 'radio-option-selected': localAnswer === option.value }">
        <input 
          type="radio" 
          :name="question.id" 
          :value="option.value"
          v-model.number="localAnswer"
          required 
          @change="onAnswerChange(option.value)"
        />
        <span class="ml-2">
          {{ t(option.textKey) }} ({{ option.value }})
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface QuestionOption {
  textKey: string;
  value: number;
}

interface Question {
  id: string;
  textKey: string;
  options: QuestionOption[];
  isCritical?: boolean;
}

const props = defineProps<{
  question: Question;
  index: number;
  modelValue: number | null;
  // t prop removed
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
  (e: 'answerChanged', payload: { questionId: string; value: number }): void;
}>();

const localAnswer = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const onAnswerChange = (value: number) => {
  emit('answerChanged', { questionId: props.question.id, value: value });
};

</script>

<style scoped>
.question-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.radio-label:hover {
  background-color: #f0f5f7;
}

.radio-label input[type="radio"] {
  margin-right: 0.75rem;
  accent-color: #005A70; /* nathan-primary */
}

.radio-option-selected {
  background-color: #e0f0f3; 
  border-color: #005A70; /* nathan-primary */
}
</style>
