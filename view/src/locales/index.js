import { ref, computed } from 'vue';
import viVNMessages from './vi_VN';
import { viVN, viVNDatePicker } from './antd_vi_VN';

// Default language
const currentLanguage = ref('vi_VN');

// Messages object
const messages = {
  'vi_VN': viVNMessages,
};

// Ant Design locales
export const antdLocales = {
  'vi_VN': viVN
};

// Ant Design DatePicker locales
export const datepickerLocales = {
  'vi_VN': viVNDatePicker
};

// Translation function
export const t = (key) => {
  const lang = currentLanguage.value;
  
  if (messages[lang] && messages[lang][key]) {
    return messages[lang][key];
  }
  
  // Return the key if translation not found
  return key;
};

// Language getter and setter
export const getLanguage = () => currentLanguage.value;
export const setLanguage = (lang) => {
  if (messages[lang]) {
    currentLanguage.value = lang;
  }
};

// Export computed language
export const language = computed(() => currentLanguage.value);

// Get Ant Design locale
export const getAntdLocale = () => {
  return antdLocales[currentLanguage.value] || antdLocales['vi_VN'];
};

// Get DatePicker locale
export const getDatePickerLocale = () => {
  return datepickerLocales[currentLanguage.value] || datepickerLocales['vi_VN'];
};
