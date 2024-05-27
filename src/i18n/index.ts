import i18next from 'i18next'
import detector from 'i18next-browser-languagedetector'

import en from './en.json'
import cn from './cn.json'
import es from './es.json'
import kr from './kr.json'

i18next.use(detector).init({
  resources: {
    en: {
      translation: en
    },
    cn: {
      translation: cn
    },
    es: {
      translation: es
    },
    kr: {
      translation: kr
    }
  },
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator']
  }
})

export default i18next
