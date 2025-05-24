<template>
  <div class="container mx-auto p-4 md:p-8 max-w-4xl">
    <AppHeader @set-language="updateLanguage" /> <!-- Removed props, Header will use useI18n -->

    <section class="mb-8 p-6 bg-white shadow-lg rounded-lg">
      <p>{{ t('intro.line1_pt1') }} <strong>{{ t('intro.past7Days') }}</strong> {{ t('intro.line1_pt2') }}</p>
      
      <div class="critical-warning mt-6">
        <p><strong>{{ t('importantWarning.title') }}</strong> {{ t('importantWarning.text') }}</p>
      </div>
      <div class="critical-emergency">
        <p><strong>{{ t('urgentWarning.title') }}</strong> {{ t('urgentWarning.text') }}</p>
      </div>
    </section>

    <section class="mb-8 p-6 bg-white shadow-lg rounded-lg">
      <h3 class="text-xl font-semibold nathan-primary mb-4">{{ t('additionalResources.title') }}</h3>
      <div class="grid md:grid-cols-2 gap-4 text-center">
        <div>
          <p class="mb-2">{{ t('additionalResources.drPan') }}</p>
          <img src="https://placehold.co/150x150/005A70/FFFFFF?text=QR+Dr.Pan" alt="QR Code for Dr. Pan's audio file" class="mx-auto rounded-md" onerror="this.src='https://placehold.co/150x150/cccccc/FFFFFF?text=Error+Loading+QR';">
        </div>
        <div>
          <p class="mb-2">{{ t('additionalResources.drLiao') }}</p>
          <img src="https://placehold.co/150x150/005A70/FFFFFF?text=QR+Dr.Liao" alt="QR Code for Dr. Liao's video" class="mx-auto rounded-md" onerror="this.src='https://placehold.co/150x150/cccccc/FFFFFF?text=Error+Loading+QR';">
        </div>
      </div>
    </section>

    <form @submit.prevent="handleSubmit">
      <section class="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <h3 class="text-xl font-semibold nathan-primary mb-6">{{ t('personalData.title') }}</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label for="age" class="form-label">{{ t('personalData.age') }}:</label>
            <input type="number" id="age" v-model.number="personalData.age" class="form-input" required>
          </div>
          <div>
            <label for="mentalProblemHistory" class="form-label">{{ t('personalData.mentalHistory') }}</label>
            <select id="mentalProblemHistory" v-model="personalData.mentalProblemHistory" class="form-select" required>
              <option value="">{{ t('personalData.select') }}</option>
              <option value="yes">{{ t('personalData.yes') }}</option>
              <option value="no">{{ t('personalData.no') }}</option>
            </select>
          </div>
          <div>
            <label for="previousPregnancies" class="form-label">{{ t('personalData.prevPregnancies') }}:</label>
            <input type="number" id="previousPregnancies" v-model.number="personalData.previousPregnancies" class="form-input" min="0" required>
          </div>
          <div>
            <label for="deliveryDate" class="form-label">{{ t('personalData.deliveryDate') }} ({{t('personalData.dateFormat')}}):</label>
            <input type="text" id="deliveryDate" v-model="personalData.deliveryDate" :placeholder="t('personalData.dateFormat')" class="form-input" required pattern="\d{2}/\d{2}/\d{4}" @blur="validateDeliveryDate">
              <small class="text-xs text-gray-500">{{ t('personalData.dateFormatHelp') }}</small>
              <p v-if="deliveryDateError" class="text-red-500 text-xs mt-1">{{ deliveryDateError }}</p>
          </div>
        </div>
      </section>

      <section class="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <h3 class="text-xl font-semibold nathan-primary mb-4">{{ t('questionnaire.title') }}</h3>
        <p class="mb-2">{{ t('questionnaire.exampleIntro') }} -</p>
        <p class="mb-1">{{ t('questionnaire.exampleQuestion') }}: "{{ t('questions.q_example.text') }}"</p>
        <div class="p-3 mb-6 border border-gray-300 rounded-md bg-gray-50">
          <ul class="list-none">
            <li>{{ t('questions.q_example.opt0') }} (0)</li>
            <li class="font-bold text-green-600">{{ t('questions.q_example.opt1') }} √ (1)</li>
            <li>{{ t('questions.q_example.opt2') }} (2)</li>
            <li>{{ t('questions.q_example.opt3') }} (3)</li>
          </ul>
          <p class="mt-2">{{ t('questionnaire.exampleExplanation') }}</p>
        </div>

        <p class="font-semibold text-lg mb-6">{{ t('questionnaire.instruction') }}</p>

        <QuestionCard
          v-for="(question, index) in questions"
          :key="question.id"
          :question="question"
          :index="index + 1"
          v-model="answers[question.id]"
          @answer-changed="handleAnswerChanged" 
        /> <!-- Removed :t prop, QuestionCard will use useI18n -->
        
        <div v-if="showQ10Warning" class="critical-warning mt-4">
          <p><strong>{{ t('q10Warning.title') }}</strong> {{ t('q10Warning.text') }}</p>
        </div>
      </section>

      <div class="text-center">
        <button type="submit" class="btn-primary text-lg px-8 py-3" :disabled="isSubmitDisabled">
          {{ t('buttons.submitScore') }}
        </button>
      </div>
    </form>

    <ResultsModal
      :show="showResultsModal"
      :total-score="totalScore"
      :score-interpretation-h-t-m-l="scoreInterpretationHTML"
      :item10-specific-warning="item10SpecificWarning"
      :show-gemini-feature="showGeminiFeature"
      :gemini-loading="geminiLoading"
      :gemini-result-text="geminiResultText"
      :gemini-error="geminiError"
      v-model:bookingLocation="bookingData.location"
      @get-gentle-tips="getGentleTips"
      @confirm-booking="confirmBooking"
    /> <!-- Removed :t prop, ResultsModal will use useI18n -->

    <ThankYouModal
      :show="showThankYouModal"
      :thank-you-message-h-t-m-l="thankYouMessageHTML"
      @close-modal="closeThankYouModal"
    /> <!-- Removed :t prop, ThankYouModal will use useI18n -->
    
    <AppFooter /> <!-- Removed :t prop, Footer will use useI18n -->
    <div v-if="generalLoading" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-[1001]">
        <div class="loader"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n'; // Import useI18n

// Import components
import AppHeader from '../components/layout/Header.vue';
import AppFooter from '../components/layout/Footer.vue';
import QuestionCard from '../components/Questionnaire/QuestionCard.vue';
import ResultsModal from '../components/Questionnaire/ResultsModal.vue';
import ThankYouModal from '../components/Questionnaire/ThankYouModal.vue';

// Initialize vue-i18n
const { t, locale } = useI18n();

// Function to update language (called by Header component)
const updateLanguage = (lang: 'en' | 'zh') => {
  locale.value = lang;
  localStorage.setItem('epdsLang', lang); // Persist user choice
};

// Form State
const personalData = reactive({
    age: null as number | null,
    mentalProblemHistory: '',
    previousPregnancies: null as number | null,
    deliveryDate: ''
});
const deliveryDateError = ref('');
const answers = reactive<Record<string, number | null>>({}); 

const questionsDefinition = [ 
      { id: "q1", textKey: "questions.q1.text", options: [ { textKey: "questions.q1.opt0", value: 0 }, { textKey: "questions.q1.opt1", value: 1 }, { textKey: "questions.q1.opt2", value: 2 }, { textKey: "questions.q1.opt3", value: 3 } ] },
      { id: "q2", textKey: "questions.q2.text", options: [ { textKey: "questions.q2.opt0", value: 0 }, { textKey: "questions.q2.opt1", value: 1 }, { textKey: "questions.q2.opt2", value: 2 }, { textKey: "questions.q2.opt3", value: 3 } ] },
      { id: "q3", textKey: "questions.q3.text", options: [ { textKey: "questions.q3.opt0", value: 0 }, { textKey: "questions.q3.opt1", value: 1 }, { textKey: "questions.q3.opt2", value: 2 }, { textKey: "questions.q3.opt3", value: 3 } ] },
      { id: "q4", textKey: "questions.q4.text", options: [ { textKey: "questions.q4.opt0", value: 0 }, { textKey: "questions.q4.opt1", value: 1 }, { textKey: "questions.q4.opt2", value: 2 }, { textKey: "questions.q4.opt3", value: 3 } ] },
      { id: "q5", textKey: "questions.q5.text", options: [ { textKey: "questions.q5.opt0", value: 0 }, { textKey: "questions.q5.opt1", value: 1 }, { textKey: "questions.q5.opt2", value: 2 }, { textKey: "questions.q5.opt3", value: 3 } ] },
      { id: "q6", textKey: "questions.q6.text", options: [ { textKey: "questions.q6.opt0", value: 0 }, { textKey: "questions.q6.opt1", value: 1 }, { textKey: "questions.q6.opt2", value: 2 }, { textKey: "questions.q6.opt3", value: 3 } ] },
      { id: "q7", textKey: "questions.q7.text", options: [ { textKey: "questions.q7.opt0", value: 0 }, { textKey: "questions.q7.opt1", value: 1 }, { textKey: "questions.q7.opt2", value: 2 }, { textKey: "questions.q7.opt3", value: 3 } ] },
      { id: "q8", textKey: "questions.q8.text", options: [ { textKey: "questions.q8.opt0", value: 0 }, { textKey: "questions.q8.opt1", value: 1 }, { textKey: "questions.q8.opt2", value: 2 }, { textKey: "questions.q8.opt3", value: 3 } ] },
      { id: "q9", textKey: "questions.q9.text", options: [ { textKey: "questions.q9.opt0", value: 0 }, { textKey: "questions.q9.opt1", value: 1 }, { textKey: "questions.q9.opt2", value: 2 }, { textKey: "questions.q9.opt3", value: 3 } ] },
      { id: "q10", textKey: "questions.q10.text", options: [ { textKey: "questions.q10.opt0", value: 0 }, { textKey: "questions.q10.opt1", value: 1 }, { textKey: "questions.q10.opt2", value: 2 }, { textKey: "questions.q10.opt3", value: 3 } ], isCritical: true }
];
const questions = ref(questionsDefinition);

// UI State
const showQ10Warning = ref(false);
const showResultsModal = ref(false);
const showThankYouModal = ref(false);
const totalScore = ref(0);
const q10Score = ref(0);
const scoreInterpretationHTML = ref('');
const item10SpecificWarning = ref(false);
const thankYouMessageHTML = ref('');
const generalLoading = ref(false);

// Booking State
const bookingData = reactive({ location: '' });

// Gemini Feature State
const showGeminiFeature = ref(false);
const geminiLoading = ref(false);
const geminiResultText = ref('');
const geminiError = ref('');

const isSubmitDisabled = computed(() => {
    if (!personalData.age || !personalData.mentalProblemHistory || personalData.previousPregnancies === null || !personalData.deliveryDate || deliveryDateError.value) {
        return true;
    }
    for (const question of questions.value) {
        if (answers[question.id] === null || answers[question.id] === undefined) {
            return true;
        }
    }
    return false;
});

const validateDeliveryDate = () => {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (personalData.deliveryDate && !datePattern.test(personalData.deliveryDate)) {
        deliveryDateError.value = t('personalData.dateFormatError');
    } else if (personalData.deliveryDate) {
        const parts = personalData.deliveryDate.split("/");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        if (month < 1 || month > 12 || day < 1 || day > 31) { 
            deliveryDateError.value = t('personalData.dateInvalidError');
        } else {
            deliveryDateError.value = "";
        }
    } else {
        deliveryDateError.value = ""; 
    }
};

const handleAnswerChanged = (payload: { questionId: string; value: number }) => {
    if (payload.questionId === 'q10') {
        showQ10Warning.value = payload.value >= 1 && payload.value <= 3;
    }
};

const handleSubmit = async () => {
    if (deliveryDateError.value) {
        alert(t('formErrors.generalFormError'));
        return;
    }
    if (isSubmitDisabled.value) {
        alert(t('formErrors.generalFormError'));
        return;
    }

    generalLoading.value = true;
    let currentTotal = 0;
    let currentQ10Score = 0;
    
    questions.value.forEach(q => {
        const value = Number(answers[q.id]);
        currentTotal += value;
        if (q.isCritical) {
            currentQ10Score = value;
        }
    });

    totalScore.value = currentTotal;
    q10Score.value = currentQ10Score;
    
    updateScoreInterpretation();
    showResultsModal.value = true;
    generalLoading.value = false;
    
    console.log("Form Submitted (No Firebase - Logged from Vue Component):");
    console.log("Personal Data:", JSON.parse(JSON.stringify(personalData)));
    console.log("Answers:", JSON.parse(JSON.stringify(answers)));
    console.log("Total Score:", totalScore.value);
    console.log("Q10 Score:", q10Score.value);
    console.log("Language at Submission:", locale.value); // Use vue-i18n locale
};

const updateScoreInterpretation = () => {
    let interpretationKey = "";
    if (totalScore.value >= 0 && totalScore.value <= 9) {
        interpretationKey = "scoreInterpretation.low";
    } else if (totalScore.value >= 10 && totalScore.value <= 12) {
        interpretationKey = "scoreInterpretation.medium";
    } else if (totalScore.value >= 13) {
        interpretationKey = "scoreInterpretation.high";
    }
    scoreInterpretationHTML.value = `<p class="mb-2">${t(interpretationKey)}</p>`;
    item10SpecificWarning.value = q10Score.value >= 1 && q10Score.value <= 3;
    showGeminiFeature.value = totalScore.value <= 12 && q10Score.value === 0;
    if(showGeminiFeature.value) {
      geminiResultText.value = ''; 
      geminiError.value = '';
    }
};

const getGentleTips = async () => {
    geminiLoading.value = true;
    geminiResultText.value = '';
    geminiError.value = '';
    const prompt = `You are a compassionate assistant. A new mother has just completed a well-being questionnaire. Her score suggests she might be experiencing some mild to moderate distress but is not in a high-risk category. Generate the following for her, in a gentle and supportive tone, IN ENGLISH:
1.  Three short, encouraging affirmations. Each affirmation should be on a new line.
2.  Two simple, general, non-medical coping strategies for managing everyday stress. Each strategy should be on a new line.
Frame this as general suggestions, not medical advice. Start the response with 'Here are some gentle thoughts and tips that might be helpful:' and end with 'Remember, these are just general suggestions. If you continue to feel overwhelmed, please reach out to your healthcare provider or a trusted support person.' Ensure the output is plain text.`;

    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    try {
        if (!apiKey) {
          throw new Error("API key is missing. Cannot fetch tips.");
        }
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            geminiResultText.value = result.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected response structure from Gemini API (Vue):', result);
            geminiError.value = t('geminiErrors.unexpectedResponse');
        }
    } catch (error: any) {
        console.error('Error fetching from Gemini API (Vue):', error);
        geminiError.value = t('geminiErrors.fetchError', { error: error.message });
    } finally {
        geminiLoading.value = false;
    }
};

const confirmBooking = async () => {
    generalLoading.value = true;
    const selectedLocationKey = bookingData.location; 
    let selectedLocationText = "";

    if (selectedLocationKey) {
        const locationMap: Record<string, string> = {
            "CN": t('booking.locations.cn'), "HV": t('booking.locations.hv'),
            "TH": t('booking.locations.th'), "Dr. Pan": t('booking.locations.drPan'),
            "Dr. Liao": t('booking.locations.drLiao')
        };
        selectedLocationText = locationMap[selectedLocationKey] || selectedLocationKey;
        const routingMap: Record<string, string> = {
            "CN": "MHC-CN email", "HV": "MHC-HV email", "TH": "MHC-TH email",
            "Dr. Pan": "MHC-TH email (for Dr. Pan)", "Dr. Liao": "MHC-CN email (for Dr. Liao)"
        };
        thankYouMessageHTML.value = t('thankYouModal.bookingMade', { location: selectedLocationText, routing: routingMap[selectedLocationKey] || 'Selected option' });
    } else {
        thankYouMessageHTML.value = t('thankYouModal.bookingNotMade');
    }
    
    console.log("Booking Choice (No Firebase - Logged from Vue Component):", {
        locationKey: selectedLocationKey,
        locationText: selectedLocationText,
        languageAtBooking: locale.value // Use vue-i18n locale
    });

    showResultsModal.value = false;
    showThankYouModal.value = true;
    generalLoading.value = false;
};

const closeThankYouModal = () => {
    showThankYouModal.value = false;
    Object.assign(personalData, { age: null, mentalProblemHistory: '', previousPregnancies: null, deliveryDate: '' });
    Object.keys(answers).forEach(key => answers[key] = null); 
    totalScore.value = 0;
    q10Score.value = 0;
    showQ10Warning.value = false;
    geminiResultText.value = '';
    geminiError.value = '';
    bookingData.location = '';
};

// Initialize answers reactive object
questions.value.forEach(q => {
    answers[q.id] = null; 
});

</script>

<style scoped>
/* Styles specific to QuestionnaireView can go here if needed.
   Most specific styles for cards, modals etc. have been moved to their respective components.
   Global styles are in App.vue.
*/
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
</style>
