import { createI18n } from 'vue-i18n';
import enMessages from './locales/en.json';
import zhMessages from './locales/zh.json';

// Function to get the initial locale
function getInitialLocale(): string {
  const savedLang = localStorage.getItem('epdsLang');
  if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
    return savedLang;
  }
  // Basic browser language detection (can be expanded)
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'zh') {
    return 'zh';
  }
  return 'en'; // Default to English
}

const i18n = createI18n({
  legacy: false, // Important for Composition API
  locale: getInitialLocale(), // Default locale
  fallbackLocale: 'en', // Fallback locale
  messages: {
    en: enMessages,
    zh: zhMessages,
  },
  // Silence warnings about missing translations for fallback
  // missingWarn: false,
  // fallbackWarn: false,
});

export default i18n;
